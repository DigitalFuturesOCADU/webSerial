/*
Example 2 : Mouse Position to WebSerial

This sketch demonstrates sending mouse position over WebSerial.
It maps the mouse X and Y coordinates to a 0-255 range and visualizes
the values using ellipses on the right side of the canvas.

Key variables:
- port: WebSerial port object
- connectBtn: Button for connecting/disconnecting WebSerial
- convertedX, convertedY: Mapped values of mouse position (0-255)

Key functions:
- updateConvertedValues(): Maps mouse position to 0-255 range
- sendDataToArduino(): Sends converted values over WebSerial
- drawVisualElements(): Draws crosshairs and ellipses representing X and Y values

Arduino code:
https://github.com/DigitalFuturesOCADU/CC2024/blob/main/experiment3/examples/example1_controlLEDs/arduino/serial_read2Vals_LEDbrightness/serial_read2Vals_LEDbrightness.ino
*/

let port;
let connectBtn;
let convertedX, convertedY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  
  initializeSerial();
  createConnectButton();
}

function draw() {
  background(220);
  updateConnectButton();
  
  if (port.opened()) {
    updateConvertedValues();
    sendDataToArduino();
    drawVisualElements();
    displayText();
  }
}

function initializeSerial() {
  // Initialize WebSerial port
  port = createSerial();
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

function updateConvertedValues() {
  // Map mouse position to 0-255 range
  convertedX = map(mouseX, 0, width, 0, 255);
  convertedY = map(mouseY, 0, height, 0, 255);
}

function sendDataToArduino() {
  // Send converted X and Y values over WebSerial
  let dataString = (round(convertedX)+","+round(convertedY)+"\n");
  port.write(dataString);
  
  //console.log("Sent data:", dataString.trim());
}

function drawVisualElements() {
  // Draw crosshairs following mouse position
  stroke(0);
  line(mouseX, 0, mouseX, height);
  line(0, mouseY, width, mouseY);
  
  // Calculate center position for ellipses
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Draw ellipses for X value
  stroke(255,0,0);
  fill(255, 0, 0, convertedX);
  ellipse(centerX - 50, centerY, 80, 80);
  ellipse(centerX + 50, centerY, 80, 80);
  
  // Draw ellipses for Y value
  fill(255, 0, 0, convertedY);
  ellipse(centerX - 50, centerY + 100, 80, 80);
  ellipse(centerX + 50, centerY + 100, 80, 80);
}

function displayText() {
  // Display current mouse position and converted values
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text(`X: ${mouseX} px (${round(convertedX)})`, 10, 10);
  text(`Y: ${mouseY} px (${round(convertedY)})`, 10, 30);
}

function connectBtnClick() {
  // Handle connect/disconnect button click
  if (!port.opened()) {
    port.open('Arduino', 57600);
  } else {
    port.close();
  }
}

function windowResized() {
  // Resize canvas when window is resized
  resizeCanvas(windowWidth, windowHeight);
}