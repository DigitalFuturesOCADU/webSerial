/*
Example 1: Slider Controls to WebSerial

This sketch demonstrates sending user-controlled slider values over WebSerial.
It uses two sliders for X and Y values (0-255 range) and visualizes
the values using ellipses at the center of the canvas.

Key variables:
- port: WebSerial port object
- connectBtn: Button for connecting/disconnecting WebSerial
- convertedX, convertedY: Values from X and Y sliders (0-255)
- sliderX, sliderY: Slider objects for controlling X and Y values

Key functions:
- createSliders(): Creates and positions the X and Y sliders
- updateConvertedValues(): Updates values from sliders
- sendDataToArduino(): Sends slider values over WebSerial
- drawVisualElements(): Draws ellipses representing X and Y values

Arduino code:
https://github.com/DigitalFuturesOCADU/CC2024/blob/main/experiment3/examples/example1_controlLEDs/arduino/serial_read2Vals_LEDbrightness/serial_read2Vals_LEDbrightness.ino
*/

let port;
let connectBtn;
let convertedX, convertedY;
let sliderX, sliderY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  
  initializeSerial();
  createConnectButton();
  createSliders();
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
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
}

function createSliders() {
  // Create and position X and Y sliders
  sliderX = createSlider(0, 255, 127);
  sliderX.position(20, height - 70);
  sliderX.style('width', '300px');

  sliderY = createSlider(0, 255, 127);
  sliderY.position(20, height - 40);
  sliderY.style('width', '300px');
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
  // Update values from sliders
  convertedX = sliderX.value();
  convertedY = sliderY.value();
}

function sendDataToArduino() {
  // Send X and Y values over WebSerial
  let dataString = (convertedX + "," + convertedY + "\n");
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
  // Display current slider values
  fill(0);
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(16);
  text(`Value 1 : ${convertedX}`, 330, height - 55);
  text(`Value 2 : ${convertedY}`, 330, height - 25);
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
  // Resize canvas and reposition sliders when window is resized
  resizeCanvas(windowWidth, windowHeight);
  sliderX.position(20, height - 70);
  sliderY.position(20, height - 40);
}