import serial
import setproctitle

from .websocket_server import WebsocketServer
from .logger import logger as base_logger

logger = base_logger.getChild(__name__)

def serial_listener(websocket_server: WebsocketServer):
    setproctitle.setproctitle("CSC_Serial_Listener")

    logger.info("Starting serial listener")
    ser = serial.Serial('COM4', 115200, timeout=1)

    while True:
        line = ser.readline().decode('utf-8').strip()  # Real implementation

        if line:
            print(f"Received serial message: '{line}'")
            websocket_server.send_to_clients(line)