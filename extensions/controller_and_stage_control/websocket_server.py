import asyncio
import json
import threading

import setproctitle
import websockets

from .logger import logger as base_logger
from .stage_controller import StageController

logger = base_logger.getChild(__name__)


class WebsocketServer:
    def __init__(self, stage_controller: StageController):
        print(logger)
        logger.debug("Websocket Server Initialization")
        self.connected_clients = set()
        self.asyncio_loop = None
        self.thread = None
        self.stage_controller = stage_controller

    async def _handle_input(self, message):
        parsed_message = json.loads(message)

        if "joystick" in parsed_message:
            self.stage_controller.change_direction(
                (parsed_message["joystick"]["x"], parsed_message["joystick"]["y"])
            )

        await self._send_to_clients(json.dumps(parsed_message))

    async def _websocket_handler(self, websocket):
        self.connected_clients.add(websocket)
        logger.debug(f"client connected: {websocket.remote_address}")
        try:
            async for message in websocket:
                await self._handle_input(message)
                logger.debug(f"Received message from client: {message}")
        except websockets.exceptions.ConnectionClosed:
            logger.debug(f"Client disconnected: {websocket.remote_address}")
        finally:
            logger.debug(f"Finally disconnected: {websocket.remote_address}")
            self.connected_clients.remove(websocket)

    async def _start_websocket_server(self):
        self.asyncio_loop = asyncio.get_running_loop()
        async with websockets.serve(self._websocket_handler, "0.0.0.0", 6789) as server:
            logger.info("Websocket server started on ws://0.0.0.0:6789")
            await server.serve_forever()

    async def _send_to_clients(self, message):
        if self.connected_clients:
            tasks = [client.send(message) for client in self.connected_clients]
            await asyncio.gather(*tasks)

    def handle_input(self, message):
        logger.debug("Sending to clients")
        if self.asyncio_loop:
            asyncio.run_coroutine_threadsafe(
                self._handle_input(message), self.asyncio_loop
            )

    def run_server(self):
        logger.debug("Running websocket server thread")
        setproctitle.setproctitle("CSC_Websocket_Server")
        asyncio.run(self._start_websocket_server())

    def run(self):
        if self.thread:
            logger.warning("Websocket server already running")
            return
        self.thread = threading.Thread(target=self.run_server)
        self.thread.start()
