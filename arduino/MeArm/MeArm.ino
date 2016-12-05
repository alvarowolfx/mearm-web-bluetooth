/*******************************************************************************************
  MeArm controlled via Bluetooth LE module

  I used the module BlueShield that uses TI CC2540 single chip bluetooth.
  http://wiki.viewc.com/blueshield-english.html

  All project can be found at
  https://github.com/alvarowolfx/mearm-web-bluetooth
  
*******************************************************************************************/

#include <Servo.h>

#include <SoftwareSerial.h>
SoftwareSerial bleSerial(10,11);

#define basePin 9
#define shoulderPin 6
#define elbowPin 5
#define gripperPin 3
#define DELAY_BETWEEN_ANGLE 15

int baseServoPos = 90;
int shoulderServoPos = 90;
int elbowServoPos = 90;
int gripPos = 0;

Servo baseServo, shoulderServo, elbowServo, gripperServo;

/*
 * https://github.com/tobiastoft/ArduinoEasing/blob/master/Easing.cpp
 */
float easeInOutSine(float t, float b, float c, float d) {
  return -c/2 * (cos(M_PI*t/d) - 1) + b;
}

void updateServo(Servo s, int oldValue, int newValue){
  if(oldValue == newValue) return;
    
  int diff = newValue - oldValue;  
  int duration = 53;
  for (int pos = 0; pos < duration; pos++){       
    s.write(easeInOutSine(pos, oldValue, diff, duration));
    delay(DELAY_BETWEEN_ANGLE);
  }
}

void updateArm(int base, int shoulder, int elbow){  
  
  updateServo(baseServo, baseServoPos, base);
  baseServoPos = base;

  updateServo(shoulderServo, shoulderServoPos, shoulder);
  shoulderServoPos = shoulder;
    
  updateServo(elbowServo, elbowServoPos, elbow);
  elbowServoPos = elbow;
}

void closeGrip(){
  updateServo(gripperServo,30,120);  
  gripPos = 0;
}

void openGrip(){
  updateServo(gripperServo,120,30);  
  gripPos = 1;
}

void updateGrip(int newValue){  
  if(newValue != gripPos){
    if(newValue){
      openGrip();
    }else{
      closeGrip();
    }
  }
}

void setup() {
  //arm.begin(basePin, shoulderPin, elbowPin, gripperPin);  

  baseServo.attach(basePin);
  shoulderServo.attach(shoulderPin);
  elbowServo.attach(elbowPin);
  gripperServo.attach(gripperPin);

  updateArm(90,90,90);
  openGrip();
  
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  bleSerial.begin(9600);    

  Serial.println("Init arm");
}


void loop() {    
  /*while(Serial.available() > 0) {
    byte c = Serial.read();
    bleSerial.print(c);    
  }*/
  byte message[4];
  int i = 0;
  int availableBytes = bleSerial.available();
  if (availableBytes > 0) {
    Serial.print("Received message: ");
    Serial.println(availableBytes);
    byte c = bleSerial.read();
    while(c != -1){
      if(i == 4) break;      
      message[i] = c;
      i++;      
      Serial.println(int(c));
      c = bleSerial.read();
    }    
  }  
  //A complete message was read
  if(i == 4){
    Serial.println("Complete message received");
    int base = message[0];
    int shoulder = message[1];
    int elbow = message[2];
    updateArm(base,shoulder,elbow);

    int grip = message[3];    
    updateGrip(grip);
  }  
}
