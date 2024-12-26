/*
Servo Body-Tracking Activity with Flexible Range Control
This sketch controls a single servo motor using ML5 body pose detection.
Students will calibrate their servo+pipe cleaner to point at detected body points.
The servo range is flexible - SERVO_MIN can be larger or smaller than SERVO_MAX,
allowing for different servo mounting orientations and motion directions.

Key Features:
- ML5 body pose detection with MoveNet
- Flexible servo range configuration
- Arrow keys to cycle through body points (0-16)
- Visual feedback with pulsing target
- Toggle video display with spacebar
*/

// CALIBRATION VARIABLES - Adjust these to match your servo's range and orientation
const SERVO_MIN = 0;    // One end of servo range (can be larger or smaller than MAX)
const SERVO_MAX = 180;  // Other end of servo range (can be larger or smaller than MIN)

// ML5 and tracking variables
let video;
let bodyPose;
let poses = [];
let bodyPointIndex = 0; // Start with nose (point 0)
let confidenceThreshold = 0.2;
let showVideo = true;
let port;
let connectBtn;
let servoVal;

function preload() {
    bodyPose = ml5.bodyPose("MoveNet", {flipped: true});
}

function setup() {
    createCanvas(640, 480);
    video = createCapture({
        video: {
            width: 640,
            height: 480,
            flipHorizontal: true
        }
    });
    video.size(640, 480);
    video.hide();
    
    bodyPose.detectStart(video, gotPoses);
    
    // Initialize serial connection and create UI elements
    initializeSerial();
    createConnectButton();
}

function draw() {
    background(220);
    
    // Display the video feed based on variable
    if(showVideo) { 
        push();
        translate(width, 0);
        scale(-1, 1);
        image(video, 0, 0, width, height);
        pop();
    }
    
    if (poses.length > 0) {
        let bodyPoint = getKeypoint(bodyPointIndex, 0);
        if (bodyPoint && bodyPoint.confidence > confidenceThreshold) {
            
            // Draw pulsing target using frameCount for animation
            // Slowed down pulse by dividing frameCount by 8
            let pulseValue = (sin(frameCount/8) + 1) * 0.5;
            let targetSize = map(pulseValue, 0, 1, 20, 40);
            let alpha = map(pulseValue, 0, 1, 100, 255);
            
            // Outer circle
            noFill();
            stroke(138, 43, 226, alpha);
            strokeWeight(2);
            circle(bodyPoint.x, height/2, targetSize * 2);
            
            // Inner circle
            fill(138, 43, 226, alpha * 0.5);
            circle(bodyPoint.x, height/2, targetSize);
            
            // Pulsing text
            textAlign(CENTER);
            textSize(16 + pulseValue * 4);
            fill(138, 43, 226, alpha);
            text("POINT HERE", bodyPoint.x, height/2 - targetSize - 10);
            
            // Display current angle under target
            text(`${round(servoVal)}°`, bodyPoint.x, height/2 + targetSize + 20);
            
            // Update and send servo value
            updateServoValue(bodyPoint.x);
            if (port.opened()) {
                sendDataToArduino();
            }
        }
    }
    
    // Display tracking info
    displayInfo();
    updateConnectButton();
}

function updateServoValue(xPos) {
    // Map detected point X position to servo range, works regardless of MIN/MAX order
    const servoStart = min(SERVO_MIN, SERVO_MAX);
    const servoEnd = max(SERVO_MIN, SERVO_MAX);
    // If SERVO_MIN > SERVO_MAX, flip the mapping direction
    servoVal = SERVO_MIN > SERVO_MAX ? 
        map(xPos, 0, width, SERVO_MIN, SERVO_MAX) :
        map(xPos, 0, width, SERVO_MIN, SERVO_MAX);
    servoVal = constrain(servoVal, servoStart, servoEnd);
}

function sendDataToArduino() {
    // Send only X value, with dummy Y value of 90
    let dataString = (round(servoVal) + ",90\n");
    port.write(dataString);
}

function displayInfo() {
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    text(`Current Range: ${SERVO_MIN}° - ${SERVO_MAX}°`, 10, 10);
    text(`Tracking Point: ${bodyPointIndex}`, 10, 30);
    text(`Current Angle: ${round(servoVal)}°`, 10, 50);
    text("Use LEFT/RIGHT arrows to change point", 10, 70);
    text("Press SPACE to toggle video", 10, 90);
}

// ML5 pose detection callback
function gotPoses(results) {
    poses = results || [];
}

// Helper function from ML5 example
function getKeypoint(pointIndex, personIndex = 0) {
    if (!poses || poses.length === 0) return null;
    if (!poses[personIndex]) return null;
    
    const keypoints = poses[personIndex].keypoints;
    if (!keypoints) return null;
    
    return keypoints[pointIndex] || null;
}

// Serial connection helper functions
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

function connectBtnClick() {
    if (!port.opened()) {
        port.open('Arduino', 57600);
    } else {
        port.close();
    }
}

function keyPressed() {
    if (key === ' ') {
        showVideo = !showVideo;
    }
    if (keyCode === LEFT_ARROW) {
        bodyPointIndex = (bodyPointIndex - 1 + 17) % 17;  // 17 points total (0-16)
    }
    if (keyCode === RIGHT_ARROW) {
        bodyPointIndex = (bodyPointIndex + 1) % 17;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}