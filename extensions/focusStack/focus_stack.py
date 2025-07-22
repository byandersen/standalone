import os
import time
import datetime
import io
import numpy as np
from typing import Optional
from PIL import Image, ImageFilter
import cv2
import pprint

from labthings import fields, current_action, find_component
from labthings.extensions import BaseExtension
from labthings.views import ActionView
from labthings.utilities import get_docstring, get_summary

from openflexure_microscope.microscope import Microscope
from openflexure_microscope.stage.base import BaseStage
from openflexure_microscope.camera.base import BaseCamera
from openflexure_microscope.utilities import set_properties
from openflexure_microscope.devel import abort


def find_microscope() -> Microscope:
    """Find and return the connected microscope component, or abort if none found."""
    microscope = find_component("org.openflexure.microscope")
    if not microscope:
        abort(503, "No microscope connected.")
    return microscope


def find_microscope_with_stage() -> Microscope:
    """Find a connected microscope with a real stage, or abort if unavailable."""
    microscope = find_microscope()
    if not microscope.has_real_stage():
        abort(503, "Microscope has no connected stage.")
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


class FocusStackExtension(BaseExtension):
    """
    Focus stacking extension: handles acquisition of a Z-stack and its fusion 
    into an all-in-focus image.
    """
    def __init__(self):
        super().__init__(
            "org.openflexure.focus_stack",
            version="1.1.0",
            description="Capture a Z-stack and fuse it into a single all-in-focus image.",
        )
        self.add_decorated_method_views()

    def add_decorated_method_views(self):
        """Register all decorated methods as Flask views for the API."""
        for k in dir(self):
            obj = getattr(self, k)
            if hasattr(obj, "flask_view"):
                self.add_view(obj.flask_view, f"/{obj.__name__}", endpoint=obj.__name__)
    
    @staticmethod
    def log(msg):
        """Write debug messages to file."""
        with open("/var/openflexure/data/z_stack/debug3.txt", "a") as f:
            f.write(pprint.pformat(msg) + "\n")

    @extension_action(
        args={
            "start_offset": fields.Int(required=True),
            "end_offset": fields.Int(required=True),
            "step_size": fields.Int(required=True),
            "settle": fields.Float(load_default=0.4),
        }
    )
    def acquire_stack(
        self,
        microscope: Optional[Microscope] = None,
        start_offset: int = -300,
        end_offset: int = 300,
        step_size: int = 50,
        settle: float = 0.4
    ):
        """
        Capture a Z-stack by moving the microscope stage along the Z-axis and recording images at each step.

        The stack is saved to a timestamped directory for later focus stacking. The method also returns to the initial position after the capture.
        If an abort signal is received (e.g. by user interrupt), the process is stopped and the stage is reset.

        Args:
            microscope (Microscope, optional): Microscope object. If None, will be auto-detected.
            start_offset (int): Z-offset from the current position for the stack's starting point.
            end_offset (int): Z-offset from the current position for the stack's ending point.
            step_size (int): Distance between each captured image along Z.
            settle (float): Wait time (in seconds) after each movement before capturing an image.

        Returns:
            dict: {
                "status" (str): "completed" if successful, or "aborted" if interrupted,
                "frames" (int): Total number of images captured,
                "directory" (str): Path to the output directory containing the stack images.
            }
        """
        if not microscope:
            microscope = find_microscope_with_stage()
        camera: BaseCamera = microscope.camera
        stage: BaseStage = microscope.stage

        # Create unique output directory for this stack
        base_dir = "/var/openflexure/data/z_stack"
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        directory = os.path.join(base_dir, timestamp)
        os.makedirs(directory, exist_ok=True)

        # Store initial stage position for reset at end
        initial_x = stage.position[0]
        initial_y = stage.position[1]
        initial_z = stage.position[2]
        positions = [initial_z + dz for dz in range(start_offset, end_offset + 1, step_size)]

        # Compute absolute Z positions to acquire
        with set_properties(stage, backlash=256), stage.lock, camera.lock:
            for idx, target_z in enumerate(positions):
                if current_action() and current_action().stopped:
                    # On abort, return to original Z
                    stage.move_abs((initial_x, initial_y, initial_z))
                    return {"status": "aborted", "captured": idx}

                # Move to Z, wait, and capture image
                stage.move_abs((initial_x, initial_y, target_z))
                time.sleep(settle)

                filename = os.path.join(directory, f"z_{idx:03d}.jpg")
                with io.BytesIO() as stream:
                    camera.capture(stream, use_video_port=False, bayer=False, resize=(1024, 768))
                    stream.seek(0)
                    image = Image.open(stream)
                    image.save(filename)
            # Restore initial Z position
            stage.move_abs((initial_x, initial_y, initial_z))
            time.sleep(settle)


        return {"status": "completed", "frames": len(positions), "directory": directory}
    
    @staticmethod
    def softmax(x, axis=0, alpha=1.0):
        """
        Compute the numerically stable softmax of an array along a specified axis,
        with optional scaling exponent (alpha).

        Args:
            x (np.ndarray): Input array (e.g., sharpness mask stack).
            axis (int, optional): Axis along which to compute softmax. Default: 0.
            alpha (float, optional): Exponent for scaling ("temperature"). Default: 1.0.

        Returns:
            np.ndarray: Array of same shape as x, normalized along 'axis'.
        """
        x_max = np.max(x, axis=axis, keepdims=True)
        e_x = np.exp(alpha * (x - x_max))
        return e_x / np.sum(e_x, axis=axis, keepdims=True)

    @staticmethod
    def pad_to_multiple(img, divisor):
        """
        Pad an image so that its height and width become exact multiples of a given divisor.

        This is necessary for constructing image pyramids, which require dimensions to be divisible by powers of two (or the chosen divisor).
        Padding is added to the bottom and right edges, using reflected border pixels.

        Args:
            img (np.ndarray): Input image array (H x W x C or H x W).
            divisor (int): The value to which height and width should be multiples.

        Returns:
            tuple:
                - np.ndarray: The padded image.
                - int: Original (unpadded) image height.
                - int: Original (unpadded) image width.
        """
        h, w = img.shape[:2]
        pad_h = (divisor - (h % divisor)) % divisor
        pad_w = (divisor - (w % divisor)) % divisor
        return cv2.copyMakeBorder(img, 0, int(pad_h), 0, int(pad_w), borderType=cv2.BORDER_REFLECT), h, w


    @staticmethod
    def build_lap_pyramid(img, levels):
        """
        Build a Laplacian pyramid from an input image.

        Args:
            img (np.ndarray): Input image (float32 or uint8).
            levels (int): Number of pyramid levels.

        Returns:
            tuple:
                - list of np.ndarray: Laplacian images, from highest to lowest resolution.
                - list of tuple: Shapes (height, width) per level.
        """
        G = img.copy()
        gp = [G]
        sizes = [G.shape[:2]]
        for i in range(levels):
            G = cv2.pyrDown(G)
            gp.append(G)
            sizes.append(G.shape[:2])

        lp = []
        # Build pyramid so lp[0] is the largest (original) resolution
        for i in range(levels):
            GE = cv2.pyrUp(gp[i+1], dstsize=(gp[i].shape[1], gp[i].shape[0]))
            L = cv2.subtract(gp[i], GE)
            lp.append(L)
        lp.append(gp[-1])  # Smallest level at the bottom
        return lp, sizes


    @staticmethod
    def reconstruct_from_lap_pyramid(lp, sizes):
        """
        Reconstruct an image from a Laplacian pyramid.

        Args:
            lp (list of np.ndarray): Laplacian images, from highest to lowest resolution.
            sizes (list of tuple): Original image shapes per level.

        Returns:
            np.ndarray: Reconstructed image (same shape as input image).
        """
        img = lp[-1]
        for i in range(len(lp) - 2, -1, -1):
            shape = sizes[i]
            img = cv2.pyrUp(img)
            img = img[:shape[0], :shape[1], ...]
            L = lp[i]
            L = L[:shape[0], :shape[1], ...]
            if img.ndim != L.ndim:
                if img.ndim == 3 and L.ndim == 2:
                    L = np.repeat(L[..., None], img.shape[2], axis=2)
                elif img.ndim == 2 and L.ndim == 3:
                    img = np.repeat(img[..., None], L.shape[2], axis=2)
            if img.dtype != L.dtype:
                img = img.astype(np.float32)
                L = L.astype(np.float32)
            img = cv2.add(img, L)
        return img


    @extension_action(
        args={
            "directory": fields.Str(required=True),
            "output_name": fields.Str(load_default="fused.jpg"),
            "levels": fields.Int(load_default=4),
            "weights_alpha": fields.Int(load_default=5),
            "blur": fields.Int(load_default=5)
        }
    )
    def fuse_stack_lap_pyramid(self, directory: str, output_name: str = "fused.jpg", levels: int = 4, weights_alpha:int = 5, blur: int = 5):
        """
        Fuse a Z-stack of images using a multi-scale Laplacian pyramid and focus blending.

        Args:
            directory (str): Directory containing stack images (.jpg)
            output_name (str): Name for the fused output image
            levels (int): Number of pyramid levels
            weights_alpha (int): Sharpness blending exponent (softmax alpha)
            blur (int): Kernel size for mask smoothing (must be odd!)

        Returns:
            dict: Status, path to output image, frame count
        """
        image_files = sorted([f for f in os.listdir(directory) if f.endswith(".jpg")])
        if not image_files:
            abort(400, "No images found in directory.")

        

        # --- Load and pad images to compatible size for pyramids
        tmp_imgs = []
        orig_h, orig_w = None, None
        max_h, max_w = 0, 0
        for f in image_files:
            img = cv2.imread(os.path.join(directory, f))
            img, h, w = self.pad_to_multiple(img, 2 ** levels)
            tmp_imgs.append((img, h, w))
            if img.shape[0] > max_h: max_h = img.shape[0]
            if img.shape[1] > max_w: max_w = img.shape[1]
            if orig_h is None: orig_h, orig_w = h, w

        imgs = []
        for img, h, w in tmp_imgs:
            # Pad all images to same maximal shape
            pad_h = max_h - img.shape[0]
            pad_w = max_w - img.shape[1]
            img = cv2.copyMakeBorder(img, 0, pad_h, 0, pad_w, borderType=cv2.BORDER_REFLECT)
            imgs.append(img)
        
        imgs = [img.astype(np.float32) for img in imgs]

        # --- Build Laplacian pyramids for all stack images
        pyramids_with_sizes = [self.build_lap_pyramid(img, levels) for img in imgs]
        pyramids = [x[0] for x in pyramids_with_sizes]
        sizes = pyramids_with_sizes[0][1]

        # --- Compute sharpness mask for each image
        sharpness_masks = []
        for img in imgs:
            img_uint8 = img.astype(np.uint8)
            img_gray = cv2.cvtColor(img_uint8, cv2.COLOR_BGR2GRAY)
            # Hybrid sharpness: Laplacian + Sobel
            lap = cv2.Laplacian(img_gray, cv2.CV_64F)
            sobel = cv2.Sobel(img_gray, cv2.CV_64F, 1, 1, ksize=3)
            sharp = np.abs(lap) + 0.5 * np.abs(sobel)
            sharpness_masks.append(np.abs(sharp))
        # Build sharpness pyramids for blending, one per image
        sharpness_pyramids = [self.build_lap_pyramid(mask.astype(np.float32), levels)[0] for mask in sharpness_masks]

         # --- Fuse images per pyramid level using sharpness weights
        fused_pyramid = []
        for level in range(levels+1):
            target_shape = sizes[level]
            # Get this level from every image, cropped to common size
            level_stack = [pyramids[i][level][:target_shape[0], :target_shape[1], ...] for i in range(len(imgs))]
            level_sharp = [sharpness_pyramids[i][level][:target_shape[0], :target_shape[1]] for i in range(len(imgs))]
            level_sharp = [s.squeeze() if s.ndim > 2 else s for s in level_sharp]
            # Smooth sharpness map (avoid artifacts)
            level_sharp = [cv2.GaussianBlur(s, (blur, blur), 0) for s in level_sharp]
            level_sharp = np.stack(level_sharp, axis=0) 
            # Compute blending weights using softmax of sharpness
            weights = self.softmax(level_sharp, axis=0, alpha=weights_alpha)

            level_stack_np = np.stack(level_stack, axis=0)
            # Weighted sum over all images
            if level_stack_np.ndim == 4:
                fused_level = np.sum(weights[..., None] * level_stack_np, axis=0)
            else:
                fused_level = np.sum(weights * level_stack_np, axis=0)
            fused_pyramid.append(fused_level)

        # --- Reconstruct all-in-focus image from fused pyramid
        fused = self.reconstruct_from_lap_pyramid(fused_pyramid, sizes)
        fused = np.clip(fused, 0, 255).astype(np.uint8)
        fused = fused[:orig_h, :orig_w] # Restore original size

        # Save result
        fused_path = os.path.join(directory, output_name if output_name.endswith(".jpg") else output_name + ".jpg")
        cv2.imwrite(fused_path, fused)
        if not microscope:
            microscope = find_microscope_with_stage()
        if microscope:
            output = microscope.captures.new_image(
                temporary=False,
            )
            byte_like_image = cv2.imencode('.jpg', fused)[1].tobytes()
            output.write(byte_like_image)
            output.flush()

            output.put_and_save()
        return {"status": "fused", "output": fused_path, "source_frames": len(image_files)}

    @extension_action(
        args={
            "start_offset": fields.Int(required=True),
            "end_offset": fields.Int(required=True),
            "step_size": fields.Int(required=True),
            "settle": fields.Float(load_default=0.4),
            "output_name": fields.Str(load_default="fused.jpg"),
            "levels": fields.Int(load_default=4),
            "weights_alpha": fields.Int(load_default=5),
            "blur": fields.Int(load_default=5)
        }
    )
    def acquire_and_fuse_stack(
        self,
        microscope: Optional[Microscope] = None,
        start_offset: int = -300,
        end_offset: int = 300,
        step_size: int = 50,
        settle: float = 0.4,
        output_name: str = "fused.jpg",
        levels: int = 4,
        weights_alpha: int = 5,
        blur: int = 5
    ):
        """
        Complete workflow: Acquire a Z-stack of images and directly fuse them into a single all-in-focus image.

        Args:
            microscope (Microscope, optional): Microscope object. If None, will auto-detect.
            start_offset (int): Relative start position for Z-stack (steps below current Z).
            end_offset (int): Relative end position for Z-stack (steps above current Z).
            step_size (int): Step size between images along Z-axis.
            settle (float): Wait time (seconds) after each movement.
            output_name (str, optional): Filename for output fused image.
            levels (int, optional): Number of pyramid levels.
            weights_alpha (int, optional): Exponent for sharpness-based blending.
            blur (int, optional): Kernel size for sharpness mask smoothing.

        Returns:
            dict: {
                "status" (str): Status message ("done" or "failed"),
                "frames" (int): Number of images captured,
                "directory" (str): Path to output directory,
                "fused_image" (str): Path to output fused image, or None if failed.
            }
        """
        # Step 1: Acquire stack
        result = self.acquire_stack(
            microscope=microscope,
            start_offset=start_offset,
            end_offset=end_offset,
            step_size=step_size,
            settle=settle
        )
        if result["status"] != "completed":
            return {"status": "failed", "message": "Stack acquisition failed", **result}

        directory = result["directory"]

        # Step 2: Fuse stack
        fused = self.fuse_stack_lap_pyramid(
            directory=directory,
            output_name=output_name,
            levels=levels,
            weights_alpha=weights_alpha,
            blur=blur
        )
        return {
            "status": "done",
            "frames": result["frames"],
            "directory": directory,
            "fused_image": fused.get("output", None)
        }

