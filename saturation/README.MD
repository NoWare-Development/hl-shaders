# Saturation shader
Simple saturation shader for Half-Life 25 Anniversary.

## Features
* Saturation
* Brightness
* Fullbright

## How to use
To configure **saturation** and **brightness** you should modify these values in shader file:
``` glsl
const float vibrance_amount = -1.0;
const float brightness = 1.0;
const bool fullbright = false;
```

* ```vibrance_amount``` - saturation value (from **-2.0** to **1.0**):
  - **-2.0** - grayscale
  - **-1.0** - default
  - **0.0** - x2 saturation
* ```brightness``` - brightness value (from **0.0** to **infinity**):
  - **0.0** - black world
  - **1.0** - default brightness
  - **2.0** - overbright
* ```fullbright``` - fullbright value (**true** or **false**):
  - **true** - fullbright world (no shadows)
  - **false** - shadows
