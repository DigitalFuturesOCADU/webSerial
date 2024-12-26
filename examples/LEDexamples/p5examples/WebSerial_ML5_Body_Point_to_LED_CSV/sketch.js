/*
ML5 Single-Person Body Pose Detection with WebSerial Communication

This sketch combines ML5 body pose detection with WebSerial communication,
allowing for sending keypoint data to an Arduino. It also includes features
to cycle through detected keypoints and toggle video display.

Key variables:
- video: Captured video feed
- bodyPose: ML5 body pose detection model
- poses: Detected pose data
- port: WebSerial port object
- currentPoint: Index of the currently selected keypoint
- showVideo: Boolean to control video display

Key functions:
- preload(): Loads the ML5 body pose model
- setup(): Initializes the sketch, video, and WebSerial
- draw(): Main loop for updating and drawing
- gotPoses(): Callback for when poses are detected
- sendDataToArduino(): Sends converted keypoint data over WebSerial
- showPoint(): Displays the current keypoint with original and converted values
- keyPressed(): Handles keyboard input for cycling points and toggling video

MoveNet Keypoint Indices:
0: nose
1: left_eye
2: right_eye
3: left_ear
4: right_ear
5: left_shoulder
6: right_shoulder
7: left_elbow
8: right_elbow
9: left_wrist
10: right_wrist
11: left_hip
12: right_hip
13: left_knee
14: right_knee
15: left_ankle
16: right_ankle
*/

let video;
let bodyPose;
let poses = [];
let confidenceThreshold = 0.2;
let flipVideo = true;
let port;
let connectBtn;
let currentPoint = 0;
let showVideo = true;

function preload() {
  bodyPose = ml5.bodyPose("Movenet", {flipped: flipVideo});
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, {flipped: flipVideo});
  video.size(640, 480);
  video.hide();
  bodyPose.detectStart(video, gotPoses);

  initializeSerial();
  createConnectButton();
}

function draw() {
  background(220);

  if (showVideo) {
    image(video, 0, 0, width, height);
  }

  if (poses.length > 0 && poses[0].keypoints.length > currentPoint) {
    let point = poses[0].keypoints[currentPoint];
    if (point.confidence > confidenceThreshold) {
      let convertedValues = getConvertedValues(point);
      showPoint(point, convertedValues, color(255, 0, 0));
   
      if (port.opened()) {
        sendDataToArduino(convertedValues);
      }
    }
  }

  updateConnectButton();
  displayText();
}

function gotPoses(results) {
  poses = results;
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
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
}

function updateConnectButton() {
  if (!port.opened()) {
    connectBtn.html('Connect to Arduino');
  } else {
    connectBtn.html('Disconnect');
  }
}

function getConvertedValues(point) {
  let convertedX = map(point.x, 0, width, 0, 255);
  let convertedY = map(point.y, 0, height, 0, 255);
  return {x: round(convertedX), y: round(convertedY)};
}

function sendDataToArduino(convertedValues) {
  let dataString = (convertedValues.x+","+convertedValues.y+"\n");
  console.log(dataString);
  port.write(dataString);
}

function showPoint(point, convertedValues, pointColor) {
  stroke(0);
  line(point.x, 0, point.x, height);
  line(0, point.y, width, point.y);
  
  // Calculate center position for ellipses
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Draw ellipses for X value
  stroke(255,0,0);
  fill(255, 0, 0, convertedValues.x);
  ellipse(centerX - 50, centerY, 80, 80);
  ellipse(centerX + 50, centerY, 80, 80);
  
  // Draw ellipses for Y value
  fill(255, 0, 0, convertedValues.y);
  ellipse(centerX - 50, centerY + 100, 80, 80);
  ellipse(centerX + 50, centerY + 100, 80, 80);
  
  
  fill(pointColor);
  noStroke();
  circle(point.x, point.y, 20);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  text(currentPoint, point.x, point.y);

  fill(255, 255, 0);
  textAlign(CENTER, TOP);
  textSize(12);
  let displayText = `${point.name}\n` +
                    `Original: (${Math.round(point.x)}, ${Math.round(point.y)})\n` +
                    `Converted: (${convertedValues.x}, ${convertedValues.y})`;
  text(displayText, point.x, point.y + 15);
}


function displayText() {
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text(`Current Point: ${currentPoint}`, 10, 50);
  text(`Video: ${showVideo ? "Shown" : "Hidden"}`, 10, 70);
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 57600);
  } else {
    port.close();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    currentPoint = (currentPoint + 1) % 17;
  } else if (keyCode === DOWN_ARROW) {
    currentPoint = (currentPoint - 1 + 17) % 17;
  } else if (key === ' ') {
    showVideo = !showVideo;
  }
}