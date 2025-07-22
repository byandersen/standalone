#include <ArduinoJson.h> 
#include <Wire.h>        


// Constant definitions //
const unsigned long DEBOUNCE_DELAY = 200; // Debounce time in milliseconds for buttons
const uint8_t JOYSTICK_ADDR = 0x20;       // I2C address of the joystick

const int VIBRATION_PIN = 3;              // Pin used for vibration motor
const unsigned long VIBRATION_DURATION = 100; // Duration of vibration in ms

const int BUTTON_PINS[4] = {25, 13, 14, 26}; // GPIO pins for the four buttons
const uint16_t JOYSTICK_THRESHOLD = 100;     // Threshold for movement detection
const unsigned long JOYSTICK_REPEAT_INTERVAL = 300; // Interval for repeated signals when joystick is held
const uint16_t JOYSTICK_MIN_MOVE_VALUE = 1000;      // Minimum value to detect active movement
const uint16_t JOYSTICK_MAX_MOVE_VALUE = 64500;     // Maximum value to detect active movement

// Data structure for a button //
typedef struct {
  int pin;                            // Corresponding GPIO pin
  volatile bool pressed;             // Flag to indicate if the button was pressed
  volatile unsigned long lastPressed; // Timestamp of last press (used for debouncing)
} Button;

Button buttons[4]; // Array to hold button states

// Variables for joystick state //
uint16_t prevX = 0, prevY = 0;       // Previous joystick X/Y positions
bool prevButton = false;            // Previous state of joystick button
unsigned long lastJoystickOutput = 0; // Timestamp of last joystick output
bool joystickHeld = false;          // Flag to detect holding movement

// Interrupt Service Routine for buttons //
void IRAM_ATTR ISR(void* arg) {
  Button* button = static_cast<Button*>(arg);      // Pointer to the corresponding button struct
  unsigned long now = millis();                    // Get current time
  if (now - button->lastPressed > DEBOUNCE_DELAY) { // Check for debounce
    button->lastPressed = now;                     // Update timestamp
    button->pressed = true;                        // Mark as pressed
  }
}

// Functions for joystick communication (via I2C) //

// Read a 16-bit register value
uint16_t read16(uint8_t reg) {
  Wire.beginTransmission(JOYSTICK_ADDR);
  Wire.write(reg);
  if (Wire.endTransmission(false) != 0) return 0xFFFF; // Return error code if transmission fails
  Wire.requestFrom(JOYSTICK_ADDR, (uint8_t)2);
  if (Wire.available() < 2) return 0xFFFF;
  uint8_t msb = Wire.read();
  uint8_t lsb = Wire.read();
  return (msb << 8) | lsb;
}

// Read an 8-bit register value
uint8_t read8(uint8_t reg) {
  Wire.beginTransmission(JOYSTICK_ADDR);
  Wire.write(reg);
  if (Wire.endTransmission(false) != 0) return 0xFF;
  Wire.requestFrom(JOYSTICK_ADDR, (uint8_t)1);
  if (Wire.available()) return Wire.read();
  return 0xFF;
}


// Feedback function for vibration motor //
void pulseVibration() {
  digitalWrite(VIBRATION_PIN, HIGH);  // Turn motor on
  delay(VIBRATION_DURATION);          // Wait for defined duration
  digitalWrite(VIBRATION_PIN, LOW);   // Turn motor off
}

// Send joystick data as JSON //
void sendJoystick(uint16_t x, uint16_t y, bool button) {
  JsonDocument doc;
  doc["joystick"]["x"] = x;
  doc["joystick"]["y"] = y;
  doc["joystick"]["button"] = button;
  doc["timestamp"] = millis();
  serializeJson(doc, Serial); // Output JSON over serial
  Serial.println();
  pulseVibration(); // Give haptic feedback
}

// Read and process joystick state //
void readJoystick() {
  uint16_t x = read16(0x03); // Read X-axis
  uint16_t y = read16(0x05); // Read Y-axis
  bool button = (read8(0x07) == 0); // Read button state (active LOW)
  unsigned long now = millis();

  // Calculate movement difference //
  int dx = abs((int)x - (int)prevX);
  int dy = abs((int)y - (int)prevY);

  bool moved = dx > JOYSTICK_THRESHOLD || dy > JOYSTICK_THRESHOLD; // Detect significant movement
  bool activeHold = (x < JOYSTICK_MIN_MOVE_VALUE || x > JOYSTICK_MAX_MOVE_VALUE || y < JOYSTICK_MIN_MOVE_VALUE || y > JOYSTICK_MAX_MOVE_VALUE); // Detect strong deviation
  bool changed = moved || (button != prevButton); // Detect change in position or button state

  if (changed) {
    joystickHeld = moved || activeHold;
    lastJoystickOutput = now;
    sendJoystick(x, y, button); // Send data if changed
    prevX = x;
    prevY = y;
    prevButton = button;
  } else if (joystickHeld && activeHold && (now - lastJoystickOutput >= JOYSTICK_REPEAT_INTERVAL)) {
    // Re-send while holding the joystick //
    lastJoystickOutput = now;
    sendJoystick(x, y, button);
  } else if (!activeHold) {
    joystickHeld = false; // Reset hold flag
  }
}

// Initialization function //
void setup() {
  Serial.begin(115200);        // Start serial communication
  delay(1000);                 // Short startup delay
  Wire.begin(21, 22);          // Initialize I2C on custom pins (SDA = 21, SCL = 22)

  pinMode(VIBRATION_PIN, OUTPUT); // Set vibration pin as output
  digitalWrite(VIBRATION_PIN, LOW);

  // Configure all buttons //
  for (int i = 0; i < 4; i++) {
    buttons[i].pin = BUTTON_PINS[i];
    buttons[i].pressed = false;
    buttons[i].lastPressed = 0;
    pinMode(buttons[i].pin, INPUT_PULLUP); // Enable internal pull-up
    attachInterruptArg(digitalPinToInterrupt(buttons[i].pin), ISR, &buttons[i], FALLING); // Trigger on falling edge
  }

  // Read initial joystick state //
  prevX = read16(0x03);
  prevY = read16(0x05);
  prevButton = (read8(0x07) == 0);
  lastJoystickOutput = millis();
}

// Main loop //
void loop() {
  // Check button states
  for (int i = 0; i < 4; i++) {
    if (buttons[i].pressed) {
      buttons[i].pressed = false; // Reset flag
      JsonDocument doc;
      doc["button"] = buttons[i].pin;     // Report pressed pin
      doc["timestamp"] = millis();
      serializeJson(doc, Serial);         // Output JSON
      Serial.println();
      pulseVibration();                   // Feedback on button press
    }
  }

  // Process joystick input //
  readJoystick();
  delay(50); // Limit polling rate
}
