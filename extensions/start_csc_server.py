from flask import Flask
from labthings import LabThing

from extensions.controller_and_stage_control import LABTHINGS_EXTENSIONS
from extensions.mini_map import LABTHINGS_EXTENSIONS as MINIMAP_EXTENSIONS

app = Flask(__name__)
labthing = LabThing(app)

for extension in LABTHINGS_EXTENSIONS:
    labthing.register_extension(extension())

for extension in MINIMAP_EXTENSIONS:
    labthing.register_extension(extension())

app.run(debug=False, use_reloader=False)