/*
Mouse Position Servo Wave Control Example with Angle Constraints
This sketch demonstrates controlling two servo motors with oscillating waves based on mouse position.
It shows how to:
1. Split the canvas into two interactive zones for independent servo control
2. Use sin waves to create smooth servo oscillation patterns within defined limits
3. Send different angles to Arduino based on mouse position
4. Provide visual feedback for active zones, servo positions, and angle limits

To extend this example:
- Add more zones for additional servo control
- Modify the oscillation patterns (try square waves or other patterns)
- Add mouse Y position for speed control
- Add interactive controls for oscillation speed and limits
- Add keyboard controls for different patterns

Arduino expects data in format: "angle1,angle2\n"
Servos should be connected to pins 2 and 3 
*/

let port;
let connectBtn;
let servoAngle1, servoAngle2;    // Values to send to Arduino (0-180)
let btnX = 20;                   // Button X position
let btnY = 20;                   // Button Y position
let waveSpeed1 = 2000;          // Wave speed for left servo (milliseconds)
let waveSpeed2 = 2000;          // Wave speed for right servo (milliseconds)

// Servo 1 constraints
let servo1Min = 45;            // Minimum angle for servo 1
let servo1Max = 135;           // Maximum angle for servo 1
let servo1Center;              // Will be calculated as middle of min/max

// Servo 2 constraints
let servo2Min = 30;            // Minimum angle for servo 2
let servo2Max = 150;           // Maximum angle for servo 2
let servo2Center;              // Will be calculated as middle of min/max

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  angleMode(DEGREES);  // Use degrees for easier servo angle calculations
  
  // Calculate center positions based on constraints
  servo1Center = (servo1Min + servo1Max) / 2;
  servo2Center = (servo2Min + servo2Max) / 2;
  
  // Initialize serial connection
  port = createSerial();
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }
  
  // Create connection button
  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(btnX, btnY);
  connectBtn.mousePressed(connectBtnClick);
}

function draw() {
  background(220);
  
  // Update button text based on connection
  if (port.opened()) {
    connectBtn.html('Disconnect');
  } else {
    connectBtn.html('Connect to Arduino');
  }
  
  if (port.opened()) {
    // Draw dividing line
    stroke(0);
    strokeWeight(1);
    line(width/2, 0, width/2, height);
    
    // Check mouse position and update values
    if (mouseX < width/2) {
      // Left side active - wave servo 1
      servoAngle1 = getWaveAngle(waveSpeed1, servo1Min, servo1Max, servo1Center);
      servoAngle2 = servo2Center;  // Keep servo 2 centered
      drawActiveZone(true);
    } else {
      // Right side active - wave servo 2
      servoAngle1 = servo1Center;  // Keep servo 1 centered
      servoAngle2 = getWaveAngle(waveSpeed2, servo2Min, servo2Max, servo2Center);
      drawActiveZone(false);
    }
    
    // Send values to Arduino
    sendDataToArduino();
    
    // Display current values and visualizations
    displayText();
    drawServoVisualizations();
  }
}

function getWaveAngle(speedMS, minAngle, maxAngle, centerAngle) {
  // Calculate amplitude based on min/max constraints
  let amplitude = (maxAngle - minAngle) / 2;
  
  // Create a sin wave that oscillates between minAngle and maxAngle
  let value = sin(360 * (millis() / speedMS)) * amplitude + centerAngle;
  
  // Constrain the value to ensure it stays within limits
  return round(constrain(value, minAngle, maxAngle));
}

function drawActiveZone(isLeft) {
  // Draw rectangle around active zone
  noFill();
  stroke(255, 0, 0);
  strokeWeight(3);
  
  if (isLeft) {
    // Left side indicator
    rect(0, 0, width/2, height);
  } else {
    // Right side indicator
    rect(width/2, 0, width/2, height);
  }
}

function drawServoVisualizations() {
  // Draw servo position indicators
  let centerY = height - 100;
  
  // Left servo visualization
  stroke(200);
  fill(255);
  arc(width/4, centerY, 80, 80, 0, 180);  // Full range arc
  
  // Draw constraint arcs for servo 1
  noFill();
  stroke(255, 200, 200);
  arc(width/4, centerY, 90, 90, servo1Min, servo1Max);  // Valid range arc
  
  // Draw min/max lines and labels for servo 1
  stroke(255, 0, 0, 100);
  line(width/4, centerY,
       width/4 + cos(servo1Min - 90) * 45,
       centerY - sin(servo1Min - 90) * 45);
  line(width/4, centerY,
       width/4 + cos(servo1Max - 90) * 45,
       centerY - sin(servo1Max - 90) * 45);
       
  // Current position line for servo 1
  stroke(255, 0, 0);
  strokeWeight(2);
  line(width/4, centerY,
       width/4 + cos(servoAngle1 - 90) * 40,
       centerY - sin(servoAngle1 - 90) * 40);
  
  // Right servo visualization
  stroke(200);
  fill(255);
  arc(3*width/4, centerY, 80, 80, 0, 180);  // Full range arc
  
  // Draw constraint arcs for servo 2
  noFill();
  stroke(200, 200, 255);
  arc(3*width/4, centerY, 90, 90, servo2Min, servo2Max);  // Valid range arc
  
  // Draw min/max lines and labels for servo 2
  stroke(0, 0, 255, 100);
  line(3*width/4, centerY,
       3*width/4 + cos(servo2Min - 90) * 45,
       centerY - sin(servo2Min - 90) * 45);
  line(3*width/4, centerY,
       3*width/4 + cos(servo2Max - 90) * 45,
       centerY - sin(servo2Max - 90) * 45);
       
  // Current position line for servo 2
  stroke(0, 0, 255);
  strokeWeight(2);
  line(3*width/4, centerY,
       3*width/4 + cos(servoAngle2 - 90) * 40,
       centerY - sin(servoAngle2 - 90) * 40);
       
  // Add min/max labels
  textSize(12);
  textAlign(CENTER);
  
  // Servo 1 labels
  fill(255, 0, 0);
  text(servo1Min + "°", 
       width/4 + cos(servo1Min - 90) * 55,
       centerY - sin(servo1Min - 90) * 55);
  text(servo1Max + "°",
       width/4 + cos(servo1Max - 90) * 55,
       centerY - sin(servo1Max - 90) * 55);
       
  // Servo 2 labels
  fill(0, 0, 255);
  text(servo2Min + "°",
       3*width/4 + cos(servo2Min - 90) * 55,
       centerY - sin(servo2Min - 90) * 55);
  text(servo2Max + "°",
       3*width/4 + cos(servo2Max - 90) * 55,
       centerY - sin(servo2Max - 90) * 55);
}

function sendDataToArduino() {
  // Send comma-separated angles with newline
  let dataString = servoAngle1 + "," + servoAngle2 + "\n";
  port.write(dataString);
}

function displayText() {
  // Display current angles
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(16);
  text("Left Servo Angle: " + servoAngle1 + "° (Range: " + servo1Min + "° - " + servo1Max + "°)", 20, height - 40);
  text("Right Servo Angle: " + servoAngle2 + "° (Range: " + servo2Min + "° - " + servo2Max + "°)", 20, height - 20);
}

function connectBtnClick() {
  // Handle connection button
  if (!port.opened()) {
    port.open('Arduino', 57600);
  } else {
    port.close();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}