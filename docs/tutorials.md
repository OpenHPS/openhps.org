---
layout: docs.njk
tags: docs
title: 'Tutorials'
menuOrder: 4
---

# Tutorial 1: Introduction


# Tutorial 2: Basics
In this tutorial you will explore the basics of OpenHPS.

## Installing @openhps/core
```bash
$ npm install @openhps/core --save
```

## Creating data objects

```ts twoslash
import { DataObject } from '@openhps/core';

// Create an object with unique identifier 'bsigner'
const myObject = new DataObject("bsigner", "Beat Signer");
```

## Creating data frames

```ts twoslash
import { DataObject, DataFrame } from '@openhps/core';

const myObject = new DataObject("bsigner", "Beat Signer");
const frame = new DataFrame();
frame.addObject(myObject);
```

## Creating a positioning model
A positioning model is a process network with graph topology, aimed to sample sensor data to an output position. In the ```ModelBuilder``` you can add nodes, shapes and services. ```SourceNode```s push data frames, ```SinkNode```s store an finalise data frames and ```ProcessingNode```s process the data frame and its contents.

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
OpenHPS distinguishes between absolute and relative positions. An absolute position represents a physical
position in a 2D, 3D or geographical space.

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
OpenHPS supports 2D, 3D and Geographical positions (with different coordinate systems) out of the box. However, there can be a scenario when you
want to represent a position in more abstract way.

In this section we create an abstract position for the Game of the Goose. A possible use case would be a positioning system that tracks the pieces on the game board.

```ts twoslash
// @experimentalDecorators: true
```

# Tutorial 5: Custom Nodes
Nodes are the most modular component of the hybrid positioning framework. Source nodes handle the creation of data frames, which can be obtained from a new custom source. Custom processing nodes can be used to implement different implementations

# Tutorial 6: Graph Shapes
Whenever you are working with a process network design, you will have to fuse data together. OpenHPS offers many default nodes for performing data fusion and flow manipulation. Common flow shapes can be immediately added in the ```ModelBuilder``` 