import os

from flask import send_file
from labthings.extensions import BaseExtension
from labthings.views import View

from .live_mapper import LiveMapper

STATIC_DIR = os.path.dirname(os.path.abspath(__file__))


class MiniMapExtension(BaseExtension):
    def __init__(self):
        super().__init__("de.hs-flensburg.mini-map", version="0.0.0")

        self.on_component("org.openflexure.microscope", self.register)

        self.add_view(MiniMapView, "/map")

    def register(self, microscope):
        """Starts thread on registration to start processing when microscope is ready"""
        self.live_mapper = LiveMapper(microscope)
        self.live_mapper.start_thread()


class MiniMapView(View):

    def get(self):
        """Get curren minimap image"""
        image_path = os.path.join(STATIC_DIR, "map.png")
        return send_file(image_path, mimetype="image/png")
