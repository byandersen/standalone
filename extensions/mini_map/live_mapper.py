import logging
import math
import queue
import threading
import time

import cv2

from .stitcher import LiveStitching


class LiveMapper:
    DISTANCE = 800

    def __init__(self, microscope):
        self.microscope = microscope
        self.queue = queue.Queue()

    @staticmethod
    def get_distance(pos1, pos2):
        return math.sqrt((pos2[0] - pos1[0]) ** 2 + (pos2[1] - pos1[1]) ** 2)

    def worker(self):
        while True:
            img, pos = self.queue.get()

            try:
                logging.debug("Try stitching image")

                new_img = self.stitcher.add_image(
                    cv2.cvtColor(img, cv2.COLOR_RGB2BGR), pos[:2]
                )
                cv2.imwrite(
                    "/var/openflexure/extensions/microscope_extensions/mini_map/placeholder.png",
                    new_img,
                )

            except Exception as e:
                logging.exception("Failed to add image")

            self.queue.task_done()

    def loop(self):
        self.stitcher = LiveStitching()
        worker = threading.Thread(target=self.worker)
        worker.start()

        last_pos: tuple = None
        while True:
            pos = self.microscope.stage.position

            if (
                last_pos is None
                or LiveMapper.get_distance(pos, last_pos) > LiveMapper.DISTANCE
            ):
                last_pos = pos
                img = self.microscope.camera.array(use_video_port=True)

                self.queue.put((img, pos))

            time.sleep(0.2)

    def start_thread(self):
        self.thread = threading.Thread(target=self.loop, name="Live Mapper")
        self.thread.start()
