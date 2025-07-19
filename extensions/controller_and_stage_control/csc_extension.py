import os
import threading

from labthings import Schema, fields
from labthings.extensions import BaseExtension
from labthings.views import PropertyView

from .serial_listener import serial_listener
from .stage_controller import StageController
from .websocket_server import WebsocketServer
from .logger import logger as base_logger

logger = base_logger.getChild(__name__)


class CSCExtension(BaseExtension):
    def __init__(self):
        super().__init__("de.hs-flensburg.controller-and-stage-control", version="0.0.0")

        self.add_view(JoystickStangeControlView, "/joystick-stage-control")

        self.on_component("org.openflexure.microscope", self.register)

    def register(self, microscope_object):
        logger.info(f"Registered {microscope_object}")
        self.stage_controller = StageController(microscope_object)
        self.stage_controller.start_thread()
        logger.info(f"Started stage controller")

        self.websocket_server = WebsocketServer(self.stage_controller)
        self.websocket_server.run()
        logger.info(f"Started websocket server")

        self.serial_listener = threading.Thread(target=serial_listener, args=(self.websocket_server,))
        self.serial_listener.start()
        logger.info(f"Started serial listener")


class JoystickStageControlSchema(Schema):
    joystick_stage_control = fields.Boolean()


class JoystickStangeControlView(PropertyView):
    schema = JoystickStageControlSchema()

    args = {
        "joystick_stage_control": fields.Boolean(
            required=True, metadata={"example": "True"}
        )
    }

    def post(self, args):
        new_state = args.joystick_stage_control

        return new_state

    def get(self):
        return {"joystick_stage_control": True}
