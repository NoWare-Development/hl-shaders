# Distortion shader
Simple distortion shader for Half-Life 25 Anniversary.

## Features
Distortion (2 types)

## How to use
To configure **distortion** you should modify these values in shader file:
``` glsl
const bool distort = false;
const int dist_type = 0;

const int dist_amount1 = 10;
const int dist_amount2 = 15;
```

* ```distort``` - turns **distortion** _on_ and _off_.
* ```dist_type``` - changes type of **distortion** (**0** or **1**)
* ```dist_amount1``` and ```dist_amount2``` - changes coefficient of **distortion**
