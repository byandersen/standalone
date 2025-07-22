# 3D-Modelle für den Mikroskop-Controller

In diesem Ordner befinden sich alle Konstruktions- und Druckdaten für das Gehäuse des Eingabegeräts zur Mikroskopsteuerung.


## Dateien

-- **controller_completely.f3d**  
  Vollständiges 3D-Modell des Controllers im Fusion 360-Format. Diese Datei enthält alle Komponenten und kann zur Weiterbearbeitung oder Anpassung in Fusion 360 geöffnet werden.  
  **Hinweis:** Fusion 360 verwendet ein integriertes Versionsverwaltungssystem. Deshalb sind keine zusätzlichen Zwischenspeicherungen oder Modellstände innerhalb der Datei sichtbar. Das Fehlen expliziter Zwischenschritte ist kein Versäumnis, sondern ergibt sich aus der Art, wie Fusion 360 Projekte strukturiert und speichert. Der Bearbeitungsverlauf kann direkt innerhalb der Fusion-Umgebung nachvollzogen werden.

- **controller_body.stl**  
  Zentrale Gehäuseeinheit mit Displayöffnung und Anschlusspunkten für die Griffe und die Rückplatte.

- **controller_left_grab.stl**  
  Linke Griffschale mit integrierter Halterung für den Vibrationsmotor und die Buttons.

- **controller_right_grip.stl**  
  Rechte Griffschale mit Aussparung für den Joystick.

- **microcontroller_holder.stl**  
  Aufnahmeplatte für den FireBeetle ESP32-E auf der Rückseite des Controllers, mit integrierter HDMI-Führung.

## Benötigte Bauteile (Mechanik)

- 30 × **Einschmelzmuttern M3**
- 26 × **Zylinderkopfschrauben M3 × 10 mm**
- 4 × **Zylinderkopfschrauben M3 × 6 mm**
- 4 × **Muttern M3**
- 6 × **Selbstschneidende Schrauben M1 × 2 mm**

## Montagehinweise

1. **Griffmontage:**  
   Die beiden Griffschalen werden zunächst mit jeweils 4 Zylinderkopfschrauben (M3 × 10 mm) und M3-Muttern am Mittelteil befestigt.

2. **Displayeinbau:**  
   Das Display wird mit M3 × 6 mm Schrauben in das zentrale Gehäuse eingesetzt. Der Micro-USB- und HDMI-Anschluss müssen zu diesem Zeitpunkt bereits am Display befestigt sein.

3. **Einbau der Bedienelemente:**  
   - Taster werden in die vorgesehene Deckplatte auf der linken Seite eingesetzt.  
   - Der Joystick wird auf der rechten Seite montiert.

4. **Verdrahtung:**  
   - Die Verbindung der Bedienelemente mit dem ESP32 erfolgt über 10 Jumper-Kabel.  
   - Ein Micro-USB-Kabel wird direkt an den 5V-Port des ESP32 angelötet, ebenso zwei 0,25 mm²-Kabel für die Versorgung des Vibrationsmotors.

5. **Abschlussmontage:**  
   - Nach der Verkabelung werden die Deckplatten der Griffe montiert.  
   - Das ESP32-Board wird in die Rückplatte eingesetzt und gemeinsam mit dem HDMI-Flachbandkabel fixiert.  
   - Abschließend wird die Rückplatte mit dem Gehäuse verschraubt.




