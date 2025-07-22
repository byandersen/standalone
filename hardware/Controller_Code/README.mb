# ESP32 Eingabegerät für Mikroskopsteuerung

Dieses Projekt implementiert die Steuerung eines Mikroskops über ein selbst entwickeltes Eingabegerät mit einem ESP32 (FireBeetle ESP32-E). Es handelt sich um ein praktisches Embedded-System, das über vier Taster, einen Joystick und haptisches Feedback durch einen Vibrationsmotor verfügt. Die Daten werden über USB als JSON ausgegeben und können z. B. von einer Mikroskop-Steuerungssoftware ausgewertet werden.

## Funktionen

- **Vier Hardware-Taster** mit Interruptsteuerung und Entprellung
- **Joystick** (I²C, mit internem ADC) zur Navigation auf X- und Y-Achse
- **Taster im Joystick** zur zusätzlichen Eingabe
- **Haptisches Feedback** durch Vibrationsmotor bei jeder Eingabe
- **JSON-Ausgabe** über serielle Schnittstelle (USB)
- **5V-Versorgung** von Display und Vibrationsmotor direkt über den Mikrocontroller


## Hardwarevoraussetzungen

- **FireBeetle ESP32-E**
- **4 Taster** (digital, mit Pull-up)
- **Joystick** mit I²C-Anbindung (z. B. Qwiic kompatibel)
- **Vibrationsmotor (5 V)**
- **Display mit HDMI-Anschluss** (optional, bei eigenem Gehäusedesign vorgesehen)

## Pinbelegung

| Komponente         | Pin am ESP32 |
|--------------------|--------------|
| Taster 1           | GPIO 25      |
| Taster 2           | GPIO 13      |
| Taster 3           | GPIO 14      |
| Taster 4           | GPIO 26      |
| Joystick (I²C SDA) | GPIO 21      |
| Joystick (I²C SCL) | GPIO 22      |
| Vibrationsmotor    | GPIO 3       |




## Verwendung

1: Code mit der Arduino-IDE auf den ESP32 hochladen.

2: Serielle Schnittstelle (115200 Baud) öffnen, um JSON-Ausgaben zu sehen.

3: Tasten drücken oder den Joystick bewegen.

4: Eingaben erscheinen direkt als JSON in der Konsole.

5: Rückmeldung über Vibration bei jeder Eingabe.