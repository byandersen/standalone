import json
import math
import time

import serial
import setproctitle

from .websocket_server import WebsocketServer
from .logger import logger as base_logger

logger = base_logger.getChild(__name__)

map_button = {
    26: 1,
    13: 3,
    14: 4,
    25: 2,
}

joystick_max = 2**16 - 1


def serial_listener(websocket_server: WebsocketServer):
    setproctitle.setproctitle("CSC_Serial_Listener")

    logger.info("Starting serial listener")

    ser = None

    while True:
        try:
            logger.debug("Trying to connect to serial port")
            ser = serial.Serial("/dev/ttyUSB0", 115200, timeout=5)
            logger.info("Connected to serial port")

            while True:
                line = ser.readline().decode("utf-8").strip()
                if not line:
                    continue

                data = json.loads(line)
                logger.debug(f"Received data: {data}")
                if "button" in data:
                    processed_data = {
                        "button": map_button[data["button"]],
                    }
                    websocket_server.handle_input(json.dumps(processed_data))

                elif "joystick" in data:
                    x = round(1 - data["joystick"]["x"] * 2 / joystick_max, 3)
                    y = round(data["joystick"]["y"] * 2 / joystick_max - 1, 3)

                    if math.sqrt((x**2 + y**2)) < 0.1:
                        x, y = 0.0, 0.0

                    processed_data = {
                        "joystick": {
                            "x": x,
                            "y": y,
                            "button": data["joystick"]["button"],
                        },
                    }
                    websocket_server.handle_input(json.dumps(processed_data))

        except serial.SerialException as e:
            logger.error(e)
        except Exception as e:
            logger.error(e)
        finally:
            if ser:
                ser.close()
            time.sleep(3)
