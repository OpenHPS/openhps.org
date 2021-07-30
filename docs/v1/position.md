---
layout: docs.njk
tags: docs
title: 'Position and Orientation'
menuOrder: 204
---
A location is often used to describe a place or area where an object is located (e.g. your location is in a certain room). A position is a more precise indicator of where an object is located (e.g. your position is at X=3 and Y=4). Similar to other positioning systems, OpenHPS uses the concepts of *relative* and *absolute* positions. 

The aforementioned position descriptions such as a place, area or XY position are called *absolute* positions, they describe a physical point inside a known space such as the Earth or a building.

When describing a position that uses a certain landmark to describe the position, the position is *relative* to this landmark. Relative positions can be expressed in distance, angle or velocity and could potentially be used to determine a more precise absolute position. In general, a relative position can not be used if the position is contained by the landmark - in that particular case you are talking about an absolute position relative to the landmark (e.g. you are in the center of a building).

## Creating a cartesian position
A cartesian position can be created using an ```Absolute2DPosition``` or ```Absolute3DPosition```.
```ts twoslash
import { Absolute2DPosition } from '@openhps/core';

const pos = new Absolute2DPosition(1, 2);
```

## Creating a geographical position
By default, geographical positions use the WGS-84 coordinate system with a latitude, longitude and
elevation in meters.

```ts twoslash
import { GeographicalPosition } from '@openhps/core';

const pos = new GeographicalPosition(50.820466, 4.392189, 9);
```

### Geographical Coordinate System
Geographical positions can be constructed from other coordinate systems than WGS-84, but will
always be stored using this coordinate system. You can find more information on available coordinate systems [here](/docs/core/classes/GCS.html).

|Name|Function|Note|
|:-|:-|:-|
|EPSG4326|```GCS.EPSG4326```||
|WGS-84|```GCS.WGS84```|(alias for EPSG4326)|
|ECEF|```GCS.ECEF```||
|EPSG3857|```GCS.EPSG3857```||

```ts twoslash
import { GeographicalPosition, Vector3, GCS } from '@openhps/core';

const pos = new GeographicalPosition();
pos.fromVector(new Vector3(50.820466, 4.392189, 9), GCS.WGS84);
```

Likewise, the ```toVector3()``` function on an ```AbsolutePosition``` accepts an optional argument
for the coordinate system.

```ts twoslash
import { GeographicalPosition, GCS } from '@openhps/core';

const pos = new GeographicalPosition(50.820466, 4.392189, 9);
pos.toVector3(GCS.ECEF);
```

## Creating a relative position

- ```RelativeDistance```: Distance to another data object.
- ```RelativeRSSI```: Received signal strength to another (transmitting) data object.
- ```RelativeAngle```: Angle to another data object.
- ```RelativeVelocity```: Relative velocity towards another object.

## Creating an orientation
Every absolute position can contain an orientation. The orientation is stored as a quaternion but can be initialized through euler angles or axis angles.