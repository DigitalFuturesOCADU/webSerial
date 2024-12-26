# WebSerial LED Examples
These examples show various methods for controlling LEDs from P5 using the [p5.webserial](https://github.com/gohai/p5.webserial) library. It sends the data a comma separated values to arduino.


## Table of Contents
- [WebSerial](#webserial)
- [P5.webserial](#p5-webserial)
- [Data Protocols](#data-protocols)
- [Arduino Code for the Examples](#arduino-code-for-the-examples)
- [Arduino Setup for the Examples](#arduino-setup-for-the-examples)
- [P5 Examples](#p5-examples)
  - [Base File](#base-file)
  - [Example 1 - Sliders](#example-1---sliders)
  - [Example 2 - Mouse X,Y](#example-2---mouse-xy)
  - [Example 3 - Window Size](#example-3---window-size)
  - [Example 4 - Window Position](#example-4---window-position)
  - [Example 5 - Mouse Fade](#example-5---mouse-fade)
  - [Example 6 - Body Point Brightness](#example-6---body-point-brightness)
  - [Example 7 - Body Point Fade](#example-7---body-point-fade)

## WebSerial

[WebSerial](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) is an API built into contemporary browsers such as Chrome and MS Edge that allows a webpage to communicate with devices attached to Serial ports of your computer. Though Serial data can be used to connect to many types of devices, the WebSerial API has specific abilities to easily connect to Arduino devices that are connected via USB. Communicating with Arduino over [Serial](https://www.arduino.cc/reference/tr/language/functions/communication/serial/) is a common method that can be used by many softwares (Processing, TouchDesigner, Max MSP, etc) and you have already used this method when you used the [Serial Monitor](https://docs.arduino.cc/software/ide-v2/tutorials/ide-v2-serial-monitor/) inside the Arduino IDE. Webserial extends this capability to any website running in a supported browser.

## P5.webserial

The [p5.webserial](https://github.com/gohai/p5.webserial) library simplifies the implementation of the WebSerial API. It provides simple methods to:

* Connect/Disconnect from an Arduino board inside P5
* Write data *to* Arduino *from* P5
* Read data *from* Arduino *to* P5

## Data Protocols

When sending information between different pieces of hardware and/or software you must create a shared language for them to *speak*. This can be done using existing, standard methods or by creating a simple one yourself. This choice is often dictated by the complexity, type, and amount of data you need to exchange. Regardless of the format, this overall process is generally the same:

**Read** the value (or values) into variables -> **Package** those values into a single string of text -> **Send** that text over the Serial Port -> **Read** the Text -> **UnWrap** text back out into the original value

For this project we will primarily focus on using Comma Separated Values (CSV) as the basis of our communication protocols. CSVs are a simple, but powerful method for sending multiple values and types of data over Serial. In short it uses the ',' as the special character to join multiple values into 1 string of text and split the text back into those values. Ie

value1 = 100;
value2 = 50;
textToSend = (value1 +","+value2+"\n"); // "100,50"  \n is the character that represents NEW LINE to show the end of the message

## Arduino Code for the Examples

[LINK](https://github.com/DigitalFuturesOCADU/CC2024/blob/main/experiment3/examples/example1_controlLEDs/arduino/serial_read2Vals_LEDbrightness/serial_read2Vals_LEDbrightness.ino)

The same Arduino Code is used for all of the following P5 examples. Once you download the code and upload it to your Arduino, you won't have to change it for any of the following P5 examples because they all share the same data protocol.

## Arduino Setup for the Examples

These examples are based on the ['KnightRider'](https://canvascloud.ocadu.ca/courses/9968/discussion_topics/171746) board where LEDs are connected to pins 2,3,4,5,6,7. However, these examples only control the LEDs connected to pins 2,3,5,6 as these are [PWM](https://support.arduino.cc/hc/en-us/articles/9350537961500-Use-PWM-output-with-Arduino) pins that allow for dimming.

If you don't still have the soldered protoboard, just connect the LEDs on a breadboard

![Arduino Nano 33 - Knight Rider - protoboard](/images/knightRiderProto.gif)

If you need to rebuild the circuit on the breadboard, here's a simple circuit diagram:

![ArduinoNano33IoT-KnightRider-bb-2LEDs](/images/knightRiderBB.png)

## P5 Examples

The series of examples use different graphic and input methods to send 2 values to the Arduino. These values control the brightness of 2 sets of LEDs:

2,3 + 5,6 (LEDs 2,3 get the same value LEDs 5,6 get the same value)

[Link to all examples as a collection](https://editor.p5js.org/npuckett/collections/T5352XtXk)

**NOTE** You can only have one controlling webpage open at a time

### Base File

[LINK](https://editor.p5js.org/npuckett/sketches/pvEgEi0vw)

This example shows the basic components needed to use the p5.webserial library to connect and send data to arduino. It provides a simple starting point for building other interactions

Control Method:
* Variable values that can be changed manually.

### Example 1 - Sliders

[LINK](https://editor.p5js.org/npuckett/full/yKyYthVq4)

Control Method:
* 2 standard HTML sliders control the brightness values

### Example 2 - Mouse X,Y

[LINK](https://editor.p5js.org/npuckett/full/woaGEUPgU)

Control Method:
* The X,Y coordinates of the mouse position are remapped as values between 0-255

### Example 3 - Window Size

[LINK](https://editor.p5js.org/npuckett/full/uoz2Zjz_v)

Control Method:
* Change the size of the browser window by dragging it. The XY size of the window is remapped as values between 0-255

### Example 4 - Window Position

[LINK](https://editor.p5js.org/npuckett/full/atzQFQEWW)

Control Method:
* Drag the browser window around your screen. The XY position of the Top Left Corner is remapped as values between 0-255

### Example 5 - Mouse Fade

[LINK](https://editor.p5js.org/npuckett/full/Ro6MIw50N)

Control Method:
* The X position of the mouse is used to determine which LEDs are pulsing and which are off. The speed of the pulsing for each can be changed in the code

### Example 6 - Body Point Brightness

[LINK](https://editor.p5js.org/npuckett/full/Hqd9OGSg-)

Control Method:
* This example uses the MoveNet Body Tracking model via ML5 to track 17 points on the body. The X,Y position of a point is remapped to values between 0-255 to control LED brightness.
* UP / DOWN arrow keys change the point being tracked
* Spacebar Shows/Hides the video

### Example 7 - Body Point Fade

[LINK](https://editor.p5js.org/npuckett/full/u67VBvkzn)

Control Method:
* Uses the X position value to determine which LEDs to fade up/down