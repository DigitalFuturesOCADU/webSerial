/*
P5.js Arduino Communication Template
This sketch provides a basic template for sending two values to Arduino via WebSerial.
It demonstrates how to:
1. Set up WebSerial communication
2. Send two values as comma-separated strings
3. Handle connection state

To extend this template:
- Modify ardVal1 and ardVal2 to use different input sources (sensors, mouse position, etc.)
- Add more visual feedback elements in drawVisualElements()
- Create additional input methods beyond the provided button
- Add data processing before sending to Arduino

Arduino expects data in format: "value1,value2\n"
Compatible with Arduino code that reads two values from Serial and splits on comma
*/

let port;
let connectBtn;
let ardVal1, ardVal2;  // Values to send to Arduino
let btnX = 20;         // Button X position
let btnY = 20;         // Button Y position

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
    // Set values to send (modify these as needed)
    ardVal1 = 10;      // Example static value
    ardVal2 = 255;     // Example static value
    
    // Send values to Arduino
    sendDataToArduino();
    
    // Draw visual feedback
    drawVisualElements();
    
    // Display current values
    displayText();
  }
}

function sendDataToArduino() {
  // Send comma-separated values with newline
  let dataString = ardVal1 + "," + ardVal2 + "\n";
  port.write(dataString);
}

function drawVisualElements() {
  // Visual feedback for the sent values
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Draw circles representing the values
  fill(255, 0, 0, ardVal1);
  ellipse(centerX - 50, centerY, 80, 80);
  
  fill(255, 0, 0, ardVal2);
  ellipse(centerX + 50, centerY, 80, 80);
}

function displayText() {
  // Display current values
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(16);
  text("Value 1: " + ardVal1, 20, height - 40);
  text("Value 2: " + ardVal2, 20, height - 20);
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