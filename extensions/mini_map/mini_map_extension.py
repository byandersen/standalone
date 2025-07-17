import os

from flask import send_file
from labthings.extensions import BaseExtension
from labthings.views import View

STATIC_DIR = os.path.dirname(os.path.abspath(__file__))


class MiniMapExtension(BaseExtension):
    def __init__(self):
        if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
            super().__init__("de.hs-flensburg.mini-map", version="0.0.0")

            self.add_view(MiniMapView, "/map")


class MiniMapView(View):

    def get(self):
        image_path = os.path.join(STATIC_DIR, 'placeholder.png')
        return send_file(image_path, mimetype="image/png")
