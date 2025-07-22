import inspect
import time
import numpy as np
from typing import Callable, Dict, List, Optional, Tuple, cast

from labthings import fields, current_action, find_component
from labthings.extensions import BaseExtension
from labthings.utilities import get_docstring, get_summary
from labthings.views import ActionView

from openflexure_microscope.microscope import Microscope
from openflexure_microscope.camera.base import BaseCamera
from openflexure_microscope.stage.base import BaseStage
from openflexure_microscope.utilities import set_properties
from openflexure_microscope.devel import abort

from .utils import get_sharpness_function

def find_microscope() -> Microscope:
    """Find and return the connected microscope component, or abort if none found."""
    microscope = find_component("org.openflexure.microscope")
    if not microscope:
        abort(503, "No microscope connected. Unable to autofocus.")
    return microscope

def find_microscope_with_real_stage() -> Microscope:
    """Find a connected microscope with a real stage, or abort if unavailable."""
    microscope = find_microscope()
    if not microscope.has_real_stage():
        abort(503, "No stage connected. Unable to autofocus.")
    return microscope

def extension_action(args=None):
    """
    Decorator to convert a method into a LabThings ActionView for API integration.
    """
    supplied_args = args
    def decorator(func):
        class ActionViewWrapper(ActionView):
            __doc__ = f"Manage actions for {func.__name__}."
            args = supplied_args

            def post(self, arguments):
                return func(self.extension, **arguments)

        ActionViewWrapper.post.description = (
            get_docstring(func, remove_newlines=False) + "\n\nThis POST request starts the action."
        )
        ActionViewWrapper.post.summary = get_summary(func)
        ActionViewWrapper.__name__ = func.__name__
        func.flask_view = ActionViewWrapper
        return func

    return decorator

class SmartAutofocusExtension(BaseExtension):
    """
    Extension for smart autofocus, supporting ROI and selectable sharpness metric.
    """
    def __init__(self):
        super().__init__(
            "org.openflexure.smart_autofocus",
            version="1.1.0",
            description="Smart autofocus with ROI support and selectable sharpness metric.",
        )
        self.add_decorated_method_views()

    def add_decorated_method_views(self):
        """Register all decorated methods as Flask views for the API."""
        for k in dir(self):
            obj = getattr(self, k)
            if hasattr(obj, "flask_view"):
                name = obj.__name__
                self.add_view(obj.flask_view, f"/{name}", endpoint=name)

    @extension_action(
        args={
            "coarse_range": fields.Int(load_default=400),
            "coarse_steps": fields.Int(load_default=5),
            "fine_range": fields.Int(load_default=100),
            "fine_steps": fields.Int(load_default=5),
            "settle": fields.Float(load_default=0.4),
            "metric_name": fields.Str(load_default="laplace4"),
            "roi": fields.List(fields.Int(), load_default=None, metadata={"description": "ROI as [x, y, width, height]"})
        }
    )
    def smart_autofocus(
        self,
        microscope: Optional[Microscope] = None,
        settle: float = 0.4,
        coarse_range: int = 400,
        coarse_steps: int = 5,
        fine_range: int = 100,
        fine_steps: int = 5,
        metric_name: str = "laplace4",
        roi: Optional[List[int]] = None,
    ) -> Tuple[List[int], List[float]]:
        """
        Perform a two-stage autofocus routine:
        1. Coarse search: Move the Z-stage across a wide range and sample sharpness.
        2. Fine search: Move in a small range around the coarse maximum, with finer steps.

        Args:
            microscope: Microscope object (optional, auto-detected if None)
            settle: Wait time after each movement (seconds)
            coarse_range: Half-width of the coarse search range (in stage units)
            coarse_steps: Number of positions in the coarse search
            fine_range: Half-width of the fine search range (centered on coarse maximum)
            fine_steps: Distance between positions in the fine search
            metric_name: Name of the sharpness metric to use
            roi: Region of interest as [x, y, width, height] (pixels)

        Returns:
            Tuple: (List of fine Z-positions, List of fine sharpness values)
        """
        if not microscope:
            microscope = find_microscope_with_real_stage()
        camera: BaseCamera = microscope.camera
        stage: BaseStage = microscope.stage
        metric_fn = get_sharpness_function(metric_name)

        with set_properties(stage, backlash=256), stage.lock, camera.lock:
            # --- Coarse scan: search over wide Z-range
            coarse_dz = np.linspace(-coarse_range, coarse_range, coarse_steps)
            coarse_positions = []
            coarse_sharpnesses = []
            for _ in stage.scan_z(coarse_dz, return_to_start=False):
                if current_action() and current_action().stopped:
                    return [], []
                time.sleep(settle)
                sharpness = self.measure_sharpness(microscope, metric_fn, roi)
                coarse_positions.append(stage.position[2])
                coarse_sharpnesses.append(sharpness)
            # Move to best coarse position
            best_coarse_z = coarse_positions[np.argmax(coarse_sharpnesses)]
            stage.move_rel((0, 0, best_coarse_z - stage.position[2]))
            # --- Fine scan: narrow range around coarse maximum
            fine_dz = np.linspace(-fine_range, fine_range, fine_steps)
            fine_positions = []
            fine_sharpnesses = []
            for _ in stage.scan_z(fine_dz, return_to_start=False):
                if current_action() and current_action().stopped:
                    return [], []
                time.sleep(settle)
                sharpness = self.measure_sharpness(microscope, metric_fn, roi)
                fine_positions.append(stage.position[2])
                fine_sharpnesses.append(sharpness)
            # Move to best fine position
            best_fine_z = fine_positions[np.argmax(fine_sharpnesses)]
            stage.move_rel((0, 0, best_fine_z - stage.position[2]))
        return fine_positions, fine_sharpnesses

    def measure_sharpness(
        self,
        microscope: Optional[Microscope] = None,
        metric_fn: Callable = None,
        roi: Optional[List[int]] = None,
    ) -> float:
        """
        Measure image sharpness using the given metric function and ROI.

        Args:
            microscope: Microscope object (optional, auto-detected if None)
            metric_fn: Sharpness function, e.g. variance, Laplacian, etc.
            roi: [x, y, width, height] in pixels; if None, center ROI is used

        Returns:
            Calculated sharpness value (float)
        """
        if not microscope:
            microscope = find_microscope_with_real_stage()
        img = microscope.camera.array(use_video_port=True)
        # If no ROI is given, use the central half of the image
        if roi is None:
            h, w = img.shape[:2]
            x = w // 4
            y = h // 4
            roi = [x, y, w // 2, h // 2]
        x, y, w_roi, h_roi = roi
        img_roi = img[y:y+h_roi, x:x+w_roi]
        return metric_fn(img_roi)