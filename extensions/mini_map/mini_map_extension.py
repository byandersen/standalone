import os

from flask import send_file
from labthings import find_component
from labthings.extensions import BaseExtension
from labthings.views import View
import cv2

from .live_mapper import LiveMapper

STATIC_DIR = os.path.dirname(os.path.abspath(__file__))


class MiniMapExtension(BaseExtension):
    def __init__(self):
        super().__init__("de.hs-flensburg.mini-map", version="0.0.0")

        self.on_component("org.openflexure.microscope", self.register)

        self.add_view(MiniMapView, "/map")
        self.add_view(TestView, "/test")

    def register(self, microscope):
        self.live_mapper = LiveMapper(microscope)
        self.live_mapper.start_thread()


class MiniMapView(View):

    def get(self):
        image_path = os.path.join(STATIC_DIR, "placeholder.png")
        return send_file(image_path, mimetype="image/png")


class TestView(View):

    def get(self):
        microscope = find_component('org.openflexure.microscope')
        output = microscope.captures.new_image(
            temporary=False,
        )

        img = cv2.imread('/var/openflexure/extensions/microscope_extensions/mini_map/placeholder.png')

        byte_like_image = cv2.imencode('.jpg', img)[1].tobytes()
        output.write(byte_like_image)
        output.flush()

        output.put_and_save()






