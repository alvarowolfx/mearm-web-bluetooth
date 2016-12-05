# MeArm web-bluetooth

Controlling a MeArm using [bluetooth support for the web](https://github.com/WebBluetoothCG/web-bluetooth).

Currently this only works in Chrome 56 or later, with chrome://flags/#enable-experimental-web-platform-features enabled.

## Hardware used

* Arduino uno
* BLE Module that works like [this one](http://wiki.viewc.com/blueshield-english.html).
* [MeArm](http://www.instructables.com/id/Pocket-Sized-Robot-Arm-meArm-V04/)
  * I made myself one with the help of a local FabLab.
  * Will need 4 micro servos.
* External battery for the servos.

The Arduino sketch can be found at `sketch` folder.

## Web part

The web part of the project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
