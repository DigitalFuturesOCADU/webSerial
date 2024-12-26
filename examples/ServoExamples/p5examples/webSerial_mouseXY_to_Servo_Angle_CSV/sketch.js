/*
Servo Control with Mouse Position via WebSerial
This sketch demonstrates controlling two servo motors using mouse position over WebSerial.
It maps the mouse X and Y coordinates to a 0-180 degree range suitable for servo control
and visualizes the servo positions using interactive arcs and lines.

Key variables:
- port: WebSerial port object
- connectBtn: Button for connecting/disconnecting WebSerial
- servoVal1, servoVal2: Mapped values of mouse position (0-180 degrees)

Key functions:
- updateServoValues(): Maps mouse position to 0-180 degree range
- sendDataToArduino(): Sends servo angles as CSV over WebSerial
- drawVisualElements(): Draws crosshairs and arc visualizations representing servo angles

Arduino code:
https://github.com/DigitalFuturesOCADU/CC2024/blob/main/experiment3/examples/example2_controlServos/webSerial_4Servo_CSV/webSerial_4Servo_CSV.ino


*/

let port;
let connectBtn;
let servoVal1, servoVal2;

function setup() {
  // Create full-window canvas and set initial background
  createCanvas(windowWidth, windowHeight);
  background(220);
  
  // Set angle mode to degrees for more intuitive angle calculations
  angleMode(DEGREES);
  
  // Initialize serial connection and create UI elements
  initializeSerial();
  createConnectButton();
}

function draw() {
  // Clear background each frame
  background(220);
  
  // Update connection button status
  updateConnectButton();
  
  // Only process and send data if connected to Arduino
  if (port.opened()) {
    updateServoValues();
    sendDataToArduino();
    drawVisualElements();
    displayText();
  }
}

function initializeSerial() {
  // Initialize WebSerial port
  port = createSerial();
  
  // Attempt to connect to the last used port
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }
}

function createConnectButton() {
  // Create and position the connect/disconnect button
  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(80, 80);
  connectBtn.mousePressed(connectBtnClick);
}

function updateConnectButton() {
  // Update button text based on connection status
  if (!port.opened()) {
    connectBtn.html('Connect to Arduino');
  } else {
    connectBtn.html('Disconnect');
  }
}

function updateServoValues() {
  // Map mouse position to servo angles (0-180 degrees)
  // X position controls Servo 1
  // Y position controls Servo 2
  servoVal1 = map(mouseX, 0, width, 0, 180);
  servoVal2 = map(mouseY, 0, height, 0, 180);
  
  // Ensure values stay within valid servo range
  servoVal1 = constrain(servoVal1, 0, 180);
  servoVal2 = constrain(servoVal2, 0, 180);
}

function sendDataToArduino() {
  // Format servo values as CSV string with newline
  // Example: "90,180\n"
  let dataString = (round(servoVal1) + "," + round(servoVal2) + "\n");
  port.write(dataString);
}

function drawVisualElements() {
  // Draw crosshairs for mouse tracking
  stroke(0);
  line(mouseX, 0, mouseX, height);  // Vertical line
  line(0, mouseY, width, mouseY);   // Horizontal line
  
  // Calculate center position for servo visualizations
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Draw visualization for Servo 1 (X position)
  stroke(255, 0, 0);
  noFill();
  // Draw arc showing full range of motion
  arc(centerX - 100, centerY, 100, 100, 0, servoVal1);
  fill(255, 0, 0);
  text("Servo 1", centerX - 130, centerY - 60);
  
  // Draw visualization for Servo 2 (Y position)
  stroke(0, 0, 255);
  noFill();
  // Draw arc showing full range of motion
  arc(centerX + 100, centerY, 100, 100, 0, servoVal2);
  fill(0, 0, 255);
  text("Servo 2", centerX + 70, centerY - 60);
  
  // Draw lines indicating current servo positions and their angles
  
  // Servo 1 (Red)
  stroke(255, 0, 0);
  // Calculate end points for servo indicator line
  let endX1 = centerX - 100 + cos(servoVal1) * 50;
  let endY1 = centerY - sin(servoVal1) * 50;
  // Draw the line
  line(centerX - 100, centerY, endX1, endY1);
  // Draw the angle text below the line
  noStroke();
  fill(255, 0, 0);
  textAlign(CENTER);
  text(`${round(servoVal1)}°`, 
       centerX - 100 + cos(servoVal1) * 65,  // Position text slightly beyond line end
       centerY - sin(servoVal1) * 65 + 15);  // Add offset for text placement
       
  // Servo 2 (Blue)
  stroke(0, 0, 255);
  // Calculate end points for servo indicator line
  let endX2 = centerX + 100 + cos(servoVal2) * 50;
  let endY2 = centerY - sin(servoVal2) * 50;
  // Draw the line
  line(centerX + 100, centerY, endX2, endY2);
  // Draw the angle text below the line
  noStroke();
  fill(0, 0, 255);
  text(`${round(servoVal2)}°`, 
       centerX + 100 + cos(servoVal2) * 65,  // Position text slightly beyond line end
       centerY - sin(servoVal2) * 65 + 15);  // Add offset for text placement
}

function displayText() {
  // Display current servo angles in degrees in top-left corner
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text(`Mouse X: ${mouseX} px`, 10, 10);
  text(`Mouse Y: ${mouseY} px`, 10, 30);
}

function connectBtnClick() {
  // Toggle serial connection when button is clicked
  if (!port.opened()) {
    port.open('Arduino', 57600);
  } else {
    port.close();
  }
}

function windowResized() {
  // Update canvas size when window is resized
  resizeCanvas(windowWidth, windowHeight);
}