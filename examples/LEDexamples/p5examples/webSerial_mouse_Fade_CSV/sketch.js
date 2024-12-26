/*
Mouse Position LED Control Example
This sketch demonstrates controlling two LED sets based on mouse position using sin waves.
It shows how to:
1. Split the canvas into two interactive zones
2. Use sin waves to create smooth LED blinking patterns
3. Send different values to Arduino based on mouse position
4. Provide visual feedback for active zones

To extend this example:
- Add more zones for additional LED control
- Modify the blink patterns (try square waves or other patterns)
- Add mouse Y position for speed control
- Add interactive controls for blink speed
- Add keyboard controls for different patterns

Arduino expects data in format: "value1,value2\n"
Arduino should connect LEDs to appropriate pins and handle 0-255 values
*/

let port;
let connectBtn;
let ardVal1, ardVal2;    // Values to send to Arduino
let btnX = 20;           // Button X position
let btnY = 20;           // Button Y position
let blinkSpeed1 = 1000;  // Blink speed for left side (milliseconds)
let blinkSpeed2 = 1000;  // Blink speed for right side (milliseconds)

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  
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
      // Left side active
      ardVal1 = getBlinkValue(blinkSpeed1);
      ardVal2 = 0;
      drawActiveZone(true);
    } else {
      // Right side active
      ardVal1 = 0;
      ardVal2 = getBlinkValue(blinkSpeed2);
      drawActiveZone(false);
    }
    
    // Send values to Arduino
    sendDataToArduino();
    
    // Display current values
    displayText();
  }
}

function getBlinkValue(speedMS) {
  // Create a sin wave that oscillates between 0 and 255
  // speedMS controls how fast one complete cycle takes
  let value = sin(TWO_PI * (millis() / speedMS)) * 127.5 + 127.5;
  return round(value);
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

function sendDataToArduino() {
  // Send comma-separated values with newline
  let dataString = ardVal1 + "," + ardVal2 + "\n";
  port.write(dataString);
}

function displayText() {
  // Display current values
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(16);
  text("Left LED Value: " + ardVal1, 20, height - 40);
  text("Right LED Value: " + ardVal2, 20, height - 20);
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