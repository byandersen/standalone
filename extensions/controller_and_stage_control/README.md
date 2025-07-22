# Controller and Stage Control

Diese OpenFlexure Extension ist das bindeglied zwischen unserem Handheld-Controller und dem OpenFlexure Mikroskope.
Sie kümmert sich um die weitergabe von Benutzereingaben wie Joystick und Knöpfe sowie das Bewegen der Stage.

- `serial_listener.py`: Kommuniziert mit der seriellen Schnittstelle des Controllers
- `stage_controller.py`: Wandelt JoyStick bewegungen in continues Stage movement
- `websocket_server.py`: Sendet User inputs an Client/Webapp
- `csc_extension.py`: Registriert OpenFlexure Extension und started Dienste 