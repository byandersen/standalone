import os
import threading

from labthings import Schema, fields
from labthings.extensions import BaseExtension
from labthings.views import PropertyView

from .serial_listener import serial_listener
from .websocket_server import WebsocketServer


class CSCExtension(BaseExtension):
    def __init__(self):
        if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
            super().__init__("de.hs-flensburg.controller-and-stage-control", version="0.0.0")

            self.add_view(JoystickStangeControlView, "/joystick-stage-control")

            self.websocket_server = WebsocketServer()
            self.websocket_server.run()

            self.serial_listener = threading.Thread(target=serial_listener, args=(self.websocket_server,))
            self.serial_listener.start()


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
