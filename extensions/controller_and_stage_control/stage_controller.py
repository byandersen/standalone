import threading

from .logger import logger as base_logger

logger = base_logger.getChild(__name__)


class StageController:
    """Joystick stage controller. It will transform the joystick directions in continues stage movement in x, y
    or z directions. It also needs to run in a thread for continuous sangaboard communication.
    """

    def __init__(self, microscope_object):
        self.microscope = microscope_object

        self.thread = None

        self._active = threading.Event()
        self.current_direction = (0, 0)
        self.focus_axis = False

    def start_control(self):
        factor = 70
        focus_factor = 30
        with self.stage.lock:  # Try locking stage. This will disable joystick movement when focus stacking is active.
            while self.current_direction != (0, 0):
                if self.focus_axis:  # Defines axis by button press
                    self.stage.board.move_rel(
                        (
                            0,
                            0,
                            int(self.current_direction[1] * focus_factor),
                        )
                    )
                else:
                    self.stage.board.move_rel(
                        (
                            -int(self.current_direction[0] * factor),
                            int(self.current_direction[1] * factor),
                            0,
                        )
                    )

    def run(self):
        while True:
            self._active.wait()
            if self.current_direction != (0, 0):
                self.start_control()

    def change_direction(self, direction, axis=False):
        """Exposed function to change joystick direction"""
        self.focus_axis = axis
        self.current_direction = direction
        if direction == (0, 0):
            self._active.clear()
        else:
            if not self._active.is_set():
                self._active.set()

    def start_thread(self):
        self.stage = self.microscope.stage

        if self.thread is not None:
            logger.debug("Already running")
        self.thread = threading.Thread(target=self.run, name="Stage Controller")
        self.thread.start()
