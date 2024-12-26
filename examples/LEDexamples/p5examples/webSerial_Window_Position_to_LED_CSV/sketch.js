/*
Example 4: Window Position to WebSerial

This sketch demonstrates sending the window's position on the screen over WebSerial.
It maps the window's X and Y position to a 0-255 range and visualizes
the values using ellipses at the center of the canvas.

Key variables:
- port: WebSerial port object
- connectBtn: Button for connecting/disconnecting WebSerial
- convertedX, convertedY: Mapped values of window position (0-255)
- windowX, windowY: Current window position on the screen

Key functions:
- updateWindowPosition(): Updates current window position
- updateConvertedValues(): Maps window position to 0-255 range
- sendDataToArduino(): Sends converted values over WebSerial
- drawVisualElements(): Draws ellipses representing X and Y values

Arduino code:
https://github.com/DigitalFuturesOCADU/CC2024/blob/main/experiment3/examples/example1_controlLEDs/arduino/serial_read2Vals_LEDbrightness/serial_read2Vals_LEDbrightness.ino
*/

let port;
let connectBtn;
let convertedX, convertedY;
let windowX, windowY;

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
    updateWindowPosition();
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

function updateWindowPosition() {
  // Update current window position
  windowX = window.screenX;
  windowY = window.screenY;
}

function updateConvertedValues() {
  // Map window position to 0-255 range
  convertedX = map(windowX, 0, screen.width - width, 0, 255);
  convertedY = map(windowY, 0, screen.height - height, 0, 255);
}

function sendDataToArduino() {
  // Send converted X and Y values over WebSerial
  let dataString = (round(convertedX)+","+round(convertedY)+"\n");
  port.write(dataString);
}

function drawVisualElements() {

  
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
  // Display current window position and converted values
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text(`Window X: ${windowX} px (${round(convertedX)})`, 10, 10);
  text(`Window Y: ${windowY} px (${round(convertedY)})`, 10, 30);
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
