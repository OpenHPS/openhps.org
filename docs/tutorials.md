---
layout: docs.njk
tags: docs
title: 'Tutorials'
menuOrder: 4
---

# Tutorial 1: Introduction
*This introduction tutorial will guide you through the various aspects of creating a (hybrid) positioning system, the different technologies available and the difficulties that normally arrive from designing a positioning system from scratch.*

## About
Outdoors we rely on Global Positioning System (GPS) to know our position. Positioning in general goes way beyond the outdoor scenario, indoors technologies like Bluetooth, UWB or Wi-Fi help to determine a position - and on a more smaller scale, positioning can be used to track the location of an item on a table or game board.

A multitude of technologies and algorithms exist - each with their own pros and cons for different scenarios. OpenHPS attempts to offer a framework to support these technologies and algorithms to develop prototype or production-ready positioning systems.

## Positioning Technologies and Algorithms
Each technology can be used differently in order to obtain a (partial) position.

## Absolute and Relative Positions
A location is often used to describe a place or area where an object is located (e.g. your location is in a certain room). A position is a more precise indicator of where an object is located (e.g. your position is at X=3 and Y=4). Many positioning systems use the concepts of *relative* and *absolute* positions. 

The aforementioned position descriptions such as a place, area or XY position are called *absolute* positions, they describe a physical point inside a known space such as the Earth or a building.

When describing a position that uses a certain landmark to describe the position, the position is *relative* to this landmark. Relative positions can be expressed in distance, angle or velocity and could potentially be used to determine a more precise absolute position. In general, a relative position can not be used if the position is contained by the landmark - in that particular case you are talking about an absolute position relative to the landmark (e.g. you are in the center of a building).

# Tutorial 2: Basics
*In this tutorial you will explore the basics functionalities of OpenHPS. We will guide you through main concepts such as data objects, data frames and how they make up a positioning model.*

## Installing @openhps/core
```bash
$ npm install @openhps/core --save
```

## Creating data objects
Data objects represent the object or person that you are trying to determine a position for. It can also represent
any other landmark or sensor that could have an absolute or relative position.

```ts twoslash
import { DataObject } from '@openhps/core';

// Create an object with unique identifier 'bsigner'
const myObject = new DataObject("bsigner", "Beat Signer");
```

A data object can be created using its constructor that takes a unique identifier and an optional display name. More information on its construction can be found in the API documentation [here](https://openhps.org/docs/core/classes/dataobject.html#constructor).

## Creating data frames
OpenHPS is a framework that processes sensor information to retrieve a position for one or more data objects. These objects are contained within an envelope called a data frame.

```ts twoslash
import { DataObject, DataFrame } from '@openhps/core';

const myObject = new DataObject("bsigner", "Beat Signer");
const frame = new DataFrame();
frame.addObject(myObject);
```

A basic data frame supports the addition of objects. Extended versions of this basic data frame also add additional sensor data.

## Creating a positioning model
A positioning model is a process network with graph topology, aimed to sample sensor data to an output position. In the ```ModelBuilder``` you can add nodes, shapes and services. ```SourceNode```s push data frames, ```SinkNode```s store an finalize data frames and ```ProcessingNode```s process the data frame and its contents.

### Example
```ts twoslash
// @alwaysStrict: false
import { 
    ModelBuilder,
    CallbackSourceNode,
    CallbackSinkNode,
    CallbackNode,
    DataFrame,
    DataObject,
    Model
} from '@openhps/core';

ModelBuilder.create()
    .from(new CallbackSourceNode(() => {
        const myObject = new DataObject("bsigner", "Beat Signer");
        const frame = new DataFrame();
        frame.addObject(myObject);
        return frame;
    }))
    .via(new CallbackNode((frame: DataFrame | DataFrame[]) => {

    }))
    .to(new CallbackSinkNode((frame: DataFrame | DataFrame[]) => {

    }))
    .build().then((model: Model) => {

    });
```

# Tutorial 3: Absolute and Relative Position
*OpenHPS distinguishes between absolute and relative positions. An absolute position represents a physical
position in a 2D, 3D or geographical space.*

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
always be stored using this coordinate system.

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


# Tutorial 4: Custom Data Types
Depending on what type of positioning system you are creating, you may find yourself
having to add data to data frames or data objects that do not exist yet.

An important design principle in OpenHPS is the serializability of every frame, object and data that is included in
those data types. This requires the use of decorators to indicate if data should be serialized.

## Creating a custom data object
```ts twoslash
// @experimentalDecorators: true
import { 
    DataObject,
    SerializableObject,
    SerializableMember
} from '@openhps/core';

@SerializableObject()
export class QRCode extends DataObject {
    @SerializableMember()
    public url: string = "";

    @SerializableMember()
    public imageBase64: string = "";
}
```

## Creating a custom data frame
```ts twoslash
// @experimentalDecorators: true
import { 
    DataFrame,
    SerializableObject,
    SerializableMember
} from '@openhps/core';

@SerializableObject()
export class QRDataFrame extends DataFrame {
    
}
```

## Create a custom position
OpenHPS supports 2D, 3D and Geographical positions (with different coordinate systems) out of the box. However, there can be a scenario when you want to represent a position in more abstract way.

In this section we create an abstract position for the Game of the Goose. A possible use case would be a positioning system that tracks the pieces on the game board.

```ts twoslash
// @experimentalDecorators: true
```

# Tutorial 5: Custom Nodes
*Nodes are the most modular component of the hybrid positioning framework. Source nodes handle the creation of data frames, which can be obtained from a new custom source. Custom processing nodes can be used to implement different implementations.*

## Creating a Source Node

## Creating a Sink Node

## Creating a Processing Node

# Tutorial 6: Graph Shapes
Whenever you are working with a process network design, you will have to fuse data together. OpenHPS offers many default nodes for performing data fusion and flow manipulation. Common flow shapes can be immediately added in the ```ModelBuilder``` 