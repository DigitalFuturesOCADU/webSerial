# WebSerial Servo Examples
These examples show various methods for controlling Servos from P5 using the [p5.webserial](https://github.com/gohai/p5.webserial) library. It sends data as comma separated values to Arduino.

## Table of Contents
- [Introduction](#introduction)
- [Connecting Servos to Arduino + Power](#connecting-servos-to-arduino--power)
  - [Prepare The Servo](#prepare-the-servo)
  - [Circuit Powering from MicroUSB](#circuit-powering-from-microusb)
  - [Circuit Powering from USB-C](#circuit-powering-from-usb-c)
  - [Testing the Connection](#testing-the-connection)
- [Arduino Code for Examples](#arduino-code-for-examples)
- [P5 Webserial Examples](#p5-webserial-examples)
  - [Example 1 - Mouse Position X Y to Servo Rotation](#example-1---mouse-position-x-y-to-servo-rotation)
  - [Example 2 - Mouse Position X to Servo Wiggle](#example-2---mouse-position-x-to-servo-wiggle)
  - [Example 3 - Timing and Motion](#example-3---timing-and-motion)

## Hardware Requirements
- Arduino board (Nano 33 IoT recommended)
- Servo motors (1-4)
- Jumper wires (3 per servo)
- Power source (USB-C or MicroUSB)

## Introduction

These examples will establish basic control and wiring methods used for controlling servo motors. This will include:

* Hello World testing of the connection / power
* Control via P5 + mouse input
* Control via ML5 + P5
* Motion Control and Timing via P5

## Connecting Servos to Arduino + Power

These examples require that you connect your servos both to your Arduino and external power. 

### Prepare The Servo

For a list of servo components and terms consult: [servoComponents-1.jpg](/images/servoComponents-1.jpg)

* For each Servo use 3 jumper wires (Pin - Pin)
  * These examples use Orange/Red/Brown to best match the Servo wire colors [jumpers.jpg](/images/jumpers.jpg)
  * Attach any of the horns to the servo and connect the jumper wires to the Servo plug: [ServoWiring.jpg](/images/ServoWiring.jpg)
* Connect the Servo to the Arduino and Power using one of the circuits below
  * ***The GND of the external power must be connected to a GND pin of the Arduino

### Circuit Powering from MicroUSB

<img src="/images/Servo-usbMicro_withPlug.png" alt="Circuit diagram for MicroUSB" width="400"/>

### Circuit Powering from USB-C

<img src="/images/Servo-usbC_withPlug.png" alt="Circuit diagram for USB-C" width="400"/>

<img src="/images/ServoConnection.png" alt="Servo Connection" width="400"/>

### Testing the Connection

To test that your servos are connected properly, download the following code and upload it to your Arduino. This is a slightly modified version of the built-in Sweep example.

[TEST CODE LINK](https://github.com/DigitalFuturesOCADU/CC2024/blob/main/experiment3/examples/SweepTest/SweepTest.ino)

## Arduino Code for Examples

This code allows you to send data from P5 to Arduino to control between 1 - 4 Servos (if you need more servos it can be easily updated). It uses the same comma separated value (CSV) format as the previous examples. It is important to remember that servos can only respond to values between 0 - 180 so the code needs to ensure it stays within that range.

```javascript
function sendDataToArduino() {
  // Send comma-separated angles with newline
  let dataString = servoAngle1 + "," + servoAngle2 + "\n";
  port.write(dataString);
}
```

This code works for all examples. Download the following code and upload it to your Arduino:

[Arduino-P5 Servo Code LINK](https://github.com/DigitalFuturesOCADU/CC2024/blob/main/experiment3/examples/example2_controlServos/webSerial_4Servo_CSV/webSerial_4Servo_CSV.ino)

[All P5 Examples LINK](https://editor.p5js.org/npuckett/collections/oPZRgfih4)

## P5 Webserial Examples

### Example 1 - Mouse Position X Y to Servo Rotation
[LINK](https://editor.p5js.org/npuckett/sketches/XOVJdcJbW)

Controls:
* X position of mouse controls Servo 1
* Y position of mouse controls Servo 2
* Resolution is re-mapped to 0-180

### Example 2 - Mouse Position X to Servo Wiggle
[LINK](https://editor.p5js.org/npuckett/sketches/fijocV1wg)

Controls:
* Depending on which side of the canvas the mouse is on, the corresponding servo wiggles
* The speed/motion is determined by values fed to a function that uses a Sin wave to control motion
* Adjust the waveSpeed + servo?Min + servo?Max to change the speed and range of motion

### Example 3 - Timing and Motion
[LINK](https://editor.p5js.org/npuckett/sketches/XDtW_VF5c)

Controls:
* X,Y position of mouse controls Servo Value on Click
* When clicked the servo moves to the new angle in the amount of time specified by its servo?Speed value
* A Servo class is created to manage the more complex controls