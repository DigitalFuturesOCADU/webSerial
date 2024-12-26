/*
Servo Control with Mouse Click and Smooth Movement via WebSerial
This sketch demonstrates controlling two servo motors using mouse clicks over WebSerial.
It maps the mouse X and Y coordinates to a 0-180 degree range suitable for servo control
and visualizes the servo positions using interactive lines. Each servo moves smoothly
to its target position in a specified time, regardless of the distance to travel.
The visualization shows both current and target positions in real-time.

Key variables:
- port: WebSerial port object
- connectBtn: Button for connecting/disconnecting WebSerial
- servo1, servo2: Servo objects managing position and movement
- moveSpeed: Time in milliseconds that any movement should take, regardless of distance
- moveStartTime: Timestamp when a movement begins, used for interpolation
- moveStartAngle: Starting position of a movement, used for interpolation
- isMoving: Flag indicating if a servo is currently in motion

Key functions:
- Servo.setTarget(): Sets new target position and initiates movement
- Servo.update(): Calculates current position using linear interpolation
- mousePressed(): Sets new target positions when mouse is clicked
- sendDataToArduino(): Sends current servo angles as CSV over WebSerial
- drawVisualElements(): Draws current and target positions with visual feedback


Movement behavior:
- Each movement takes exactly the specified time (default 1000ms)
- New targets can be set while servos are moving
- Smooth interpolation between positions
- Position updates sent continuously to Arduino

Arduino code:
https://github.com/DigitalFuturesOCADU/CC2024/blob/main/experiment3/examples/example2_controlServos/webSerial_4Servo_CSV/webSerial_4Servo_CSV.ino
*/



let port;
let connectBtn;
let servo1;
let servo1Speed = 1000;
let servo2;
let servo2Speed = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  angleMode(DEGREES);
  
  // Initialize servos with starting position and movement speed
  servo1 = new Servo(90, servo1Speed);  // 1000ms for any movement
  servo2 = new Servo(90, servo2Speed);
  
  initializeSerial();
  createConnectButton();
}

function draw() {
  background(220);
  updateConnectButton();
  
  if (port.opened()) {
    servo1.moveSpeed = servo1Speed;
    servo2.moveSpeed = servo2Speed;
    servo1.update();
    servo2.update();
    sendDataToArduino();
    drawVisualElements();
    displayText();
  }
}

////***Servo Class
class Servo {
  constructor(startAngle, moveSpeed) {
    this.currentAngle = startAngle;   // Current angle of the servo
    this.targetAngle = startAngle;    // Target angle to move to
    this.moveSpeed = moveSpeed;       // Time in ms for any movement
    this.moveStartTime = 0;           // When the current movement began
    this.moveStartAngle = startAngle; // Starting angle of current movement
    this.isMoving = false;           // Whether servo is currently moving
  }
  
  setTarget(newTarget) {
    newTarget = constrain(newTarget, 0, 180);
    if (newTarget !== this.currentAngle) {
      this.targetAngle = newTarget;
      this.moveStartAngle = this.currentAngle;
      this.moveStartTime = millis();
      this.isMoving = true;
    }
  }
  
  update() {
    if (this.isMoving) {
      // Calculate how much time has passed since movement started
      let elapsed = millis() - this.moveStartTime;
      
      // Calculate movement progress as a value from 0 to 1
      // 0 = movement just started
      // 0.5 = halfway through movement
      // 1 = movement complete
      let progress = min(elapsed / this.moveSpeed, 1);
      
      // Use linear interpolation (lerp) to calculate current position
      // lerp formula: start + (target - start) * progress
      // Example: If moving from 0° to 180° and progress is 0.5:
      //   currentAngle = 0 + (180 - 0) * 0.5 = 90 degrees
      this.currentAngle = lerp(this.moveStartAngle, this.targetAngle, progress);
      
      // Check if movement is complete
      if (progress >= 1) {
        // Stop moving
        this.isMoving = false;
        // Ensure we're exactly at target
        this.currentAngle = this.targetAngle;
      }
    }
  }
  
  getCurrentAngle() {
    return round(this.currentAngle);
  }
  
  getTargetAngle() {
    return round(this.targetAngle);
  }
}
////***Servo Class

function mousePressed() {
  if (port.opened()) {
    let targetX = map(mouseX, 0, width, 0, 180);
    let targetY = map(mouseY, 0, height, 0, 180);
    
    servo1.setTarget(targetX);
    servo2.setTarget(targetY);
  }
}

function initializeSerial() {
  port = createSerial();
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }
}

function createConnectButton() {
  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(80, 120);
  connectBtn.mousePressed(connectBtnClick);
}

function updateConnectButton() {
  if (!port.opened()) {
    connectBtn.html('Connect to Arduino');
  } else {
    connectBtn.html('Disconnect');
  }
}

function sendDataToArduino() {
  let dataString = (servo1.getCurrentAngle() + "," + 
                   servo2.getCurrentAngle() + "\n");
  port.write(dataString);
}

function drawVisualElements() {
  // Draw crosshairs for mouse tracking
  stroke(0, 100);  // Semi-transparent crosshairs
  line(mouseX, 0, mouseX, height);
  line(0, mouseY, width, mouseY);
  
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Servo 1 (Red)
  // Draw target angle as semi-transparent line
  stroke(255, 0, 0, 100);
  let targetAngle1 = servo1.getTargetAngle();
  let targetX1 = centerX - 100 + cos(targetAngle1) * 50;
  let targetY1 = centerY - sin(targetAngle1) * 50;
  line(centerX - 100, centerY, targetX1, targetY1);
  
  // Draw current angle as solid line
  stroke(255, 0, 0);
  let currentAngle1 = servo1.getCurrentAngle();
  let currentX1 = centerX - 100 + cos(currentAngle1) * 50;
  let currentY1 = centerY - sin(currentAngle1) * 50;
  line(centerX - 100, centerY, currentX1, currentY1);
  
  // Draw labels and angles
  noStroke();
  fill(255, 0, 0);
  textAlign(CENTER);
  text("Servo 1", centerX - 130, centerY - 60);
  text(`Current: ${currentAngle1}°`, 
       centerX - 100 + cos(currentAngle1) * 65,
       centerY - sin(currentAngle1) * 65 + 15);
  fill(255, 0, 0, 100);
  text(`Target: ${targetAngle1}°`,
       centerX - 100 + cos(targetAngle1) * 65,
       centerY - sin(targetAngle1) * 65 + 30);
  
  // Servo 2 (Blue)
  // Draw target angle as semi-transparent line
  stroke(0, 0, 255, 100);
  let targetAngle2 = servo2.getTargetAngle();
  let targetX2 = centerX + 100 + cos(targetAngle2) * 50;
  let targetY2 = centerY - sin(targetAngle2) * 50;
  line(centerX + 100, centerY, targetX2, targetY2);
  
  // Draw current angle as solid line
  stroke(0, 0, 255);
  let currentAngle2 = servo2.getCurrentAngle();
  let currentX2 = centerX + 100 + cos(currentAngle2) * 50;
  let currentY2 = centerY - sin(currentAngle2) * 50;
  line(centerX + 100, centerY, currentX2, currentY2);
  
  // Draw labels and angles
  noStroke();
  fill(0, 0, 255);
  text("Servo 2", centerX + 70, centerY - 60);
  text(`Current: ${currentAngle2}°`, 
       centerX + 100 + cos(currentAngle2) * 65,
       centerY - sin(currentAngle2) * 65 + 15);
  fill(0, 0, 255, 100);
  text(`Target: ${targetAngle2}°`,
       centerX + 100 + cos(targetAngle2) * 65,
       centerY - sin(targetAngle2) * 65 + 30);
}

function displayText() {
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text(`Mouse X: ${mouseX} px`, 10, 10);
  text(`Mouse Y: ${mouseY} px`, 10, 30);
  text('Click to set new servo positions', 10, 50);
  text(`Servo 1 speed : ${servo1.moveSpeed}`, 10, 70);
  text(`Servo 2 speed : ${servo2.moveSpeed}`, 10, 90);
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 57600);
  } else {
    port.close();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}