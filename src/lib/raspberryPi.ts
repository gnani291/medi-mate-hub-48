
// This file communicates with a Raspberry Pi via a backend API

export interface MotorCommand {
  motorNumber: number;
  duration: number; // milliseconds
}

// Configure your Raspberry Pi's IP address and port here
const RASPBERRY_PI_API = "http://192.168.15.66:5000/api/dispense";

// Send commands to Raspberry Pi to dispense medicine
export const dispenseFromRaspberryPi = async (motorNumber: number): Promise<boolean> => {
  console.log(`Sending command to Raspberry Pi: Activating motor ${motorNumber}`);
  
  try {
    // Make an API call to the Raspberry Pi server
    const response = await fetch(RASPBERRY_PI_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ motorNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Raspberry Pi:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('Raspberry Pi response:', data);
    return true;
  } catch (error) {
    console.error('Failed to communicate with Raspberry Pi:', error);
    
    // Fallback to simulation mode for testing when Pi is not available
    console.log('Using simulation mode instead');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[SIMULATION] Motor ${motorNumber} activated successfully`);
        resolve(true);
      }, 2000); // Simulate 2 second dispensing time
    });
  }
};

// Raspberry Pi Python code that would be running on the Pi itself
export const raspberryPiPythonCode = `
# This is the Python code that would run on the Raspberry Pi
# Save this as medi_mate_controller.py on your Raspberry Pi

import RPi.GPIO as GPIO
import time
import flask
from flask import request, jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Setup GPIO pins for the servo motors
MOTOR_PINS = [17, 18, 27, 22]  # GPIO pins for the 4 servo motors

# Initialize GPIO
GPIO.setmode(GPIO.BCM)
for pin in MOTOR_PINS:
    GPIO.setup(pin, GPIO.OUT)
    
# Initialize PWM for each motor
pwm_motors = []
for pin in MOTOR_PINS:
    pwm = GPIO.PWM(pin, 50)  # 50Hz frequency
    pwm.start(0)
    pwm_motors.append(pwm)

def set_servo_angle(motor_index, angle):
    """Set servo to a specific angle"""
    if 0 <= motor_index < len(pwm_motors):
        duty = 2 + (angle / 18)  # Convert angle to duty cycle (0-180 degrees)
        pwm_motors[motor_index].ChangeDutyCycle(duty)
        time.sleep(0.5)  # Allow time for servo to move
        pwm_motors[motor_index].ChangeDutyCycle(0)  # Stop servo jitter
    else:
        print(f"Invalid motor index: {motor_index}")

def dispense_medicine(motor_index):
    """Dispense medicine using the specified motor"""
    print(f"Dispensing medicine with motor {motor_index+1}")
    
    # Move servo to dispense position and back
    set_servo_angle(motor_index, 90)  # Move to dispense position
    time.sleep(1)                     # Wait for medicine to drop
    set_servo_angle(motor_index, 0)   # Return to starting position
    
    return True

@app.route('/api/dispense', methods=['POST'])
def api_dispense():
    """API endpoint to dispense medicine"""
    data = request.get_json()
    
    if not data or 'motorNumber' not in data:
        return jsonify({"error": "Missing motor number"}), 400
    
    motor_number = data['motorNumber']
    
    # Motor numbers in the API are 1-based, but our array is 0-based
    motor_index = motor_number - 1
    
    if motor_index < 0 or motor_index >= len(MOTOR_PINS):
        return jsonify({"error": f"Invalid motor number: {motor_number}"}), 400
    
    success = dispense_medicine(motor_index)
    
    if success:
        return jsonify({"status": "success", "message": f"Medicine dispensed using motor {motor_number}"}), 200
    else:
        return jsonify({"status": "error", "message": "Failed to dispense medicine"}), 500

@app.route('/api/test', methods=['GET'])
def api_test():
    """Test endpoint to verify the API is working"""
    return jsonify({"status": "success", "message": "MediMate API is running"}), 200

if __name__ == '__main__':
    try:
        # Run the Flask app on port 5000
        app.run(host='0.0.0.0', port=5000)
    finally:
        # Clean up GPIO on exit
        for pwm in pwm_motors:
            pwm.stop()
        GPIO.cleanup()
`;

// Connection instructions for the Raspberry Pi
export const raspberryPiSetupInstructions = `
# MediMate Raspberry Pi Setup Instructions

## Hardware Requirements
- Raspberry Pi (3B+ or newer recommended)
- 4 Servo motors
- Medicine dispensing mechanism for each servo
- Jumper wires
- Power supply for Raspberry Pi and servos

## Wiring Instructions
1. Connect servo motor 1 (fever medication) to GPIO 17
2. Connect servo motor 2 (cough medication) to GPIO 18
3. Connect servo motor 3 (cold medication) to GPIO 27
4. Connect servo motor 4 (stomach ache medication) to GPIO 22
5. Connect all servo GND wires to GND on the Raspberry Pi
6. Connect all servo VCC wires to 5V on the Raspberry Pi

## Software Setup
1. Install required Python packages:
   \`\`\`
   pip install flask flask-cors RPi.GPIO
   \`\`\`

2. Save the Python code from the application to a file named 'medi_mate_controller.py'

3. Make the file executable:
   \`\`\`
   chmod +x medi_mate_controller.py
   \`\`\`

4. Run the controller:
   \`\`\`
   python medi_mate_controller.py
   \`\`\`

5. To make the controller start automatically on boot:
   \`\`\`
   sudo nano /etc/rc.local
   \`\`\`
   
   Add the following line before 'exit 0':
   \`\`\`
   python /path/to/medi_mate_controller.py &
   \`\`\`

6. Configure your network settings to allow the Raspberry Pi to have a static IP address

## Connecting the Web Application
1. Update the API endpoint in the web application with your Raspberry Pi's IP address
2. Ensure that the Raspberry Pi and the device running the web application are on the same network
3. Test the connection by using the "Test Connection" feature in the owner dashboard
`;

// Get Raspberry Pi connection status
export const checkRaspberryPiStatus = async (): Promise<boolean> => {
  try {
    // Try to reach the test endpoint on the Raspberry Pi
    const response = await fetch(`192.168.15.66 2409:40f0:161:4162:3dfc:ee1d:bff9:17f0/api/dispense`);
    if (response.ok) {
      const data = await response.json();
      return data.status === 'success';
    }
    return false;
  } catch (error) {
    console.error('Failed to check Raspberry Pi status:', error);
    return false;
  }
};

// Get Raspberry Pi instructions
export const getRaspberryPiInstructions = (): string => {
  return raspberryPiSetupInstructions;
};

// Get Raspberry Pi Python code
export const getRaspberryPiCode = (): string => {
  return raspberryPiPythonCode;
};
