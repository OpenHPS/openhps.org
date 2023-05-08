---
layout: docs.njk
tags: docs
title: 'Positioning Model'
menuOrder: 206
---
A positioning model is a process network with graph topology, aimed to sample sensor data to an output position. In the ```ModelBuilder``` you can add nodes, shapes and services. ```SourceNode```s push data frames, ```SinkNode```s store an finalize data frames and ```ProcessingNode```s process the data frame and its contents.

## Graph node
The position model contains nodes connected with edges. A node represents a single chain in the positioning model that helps to produce a final position for one or more data objects.

```ts twoslash
import { Node } from '@openhps/core';
```

Usually, a ```SinkNode```, ```SourceNode``` or ```ProcessingNode``` is extended instead of extending the base ```Node``` class.

## Creating a positioning model
Creating a positioning model can be done using a builder design pattern. The ```ModelBuilder``` allows you to create the flow from source (e.g. sensors), to processing node (e.g. positioning algorithm) and finally to sink node (e.g. displaying or storing the result).

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
    .via(new CallbackNode((frame: DataFrame) => {

    }))
    .to(new CallbackSinkNode((frame: DataFrame) => {

    }))
    .build().then((model: Model) => {

    });
```

## Merging ```DataFrame```s

### Merging streams of data frames
Merging multiple streams of data frames can be done without much interference.

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
    }), new CallbackSourceNode(() => {
        const myObject = new DataObject("bsigner", "Beat Signer");
        const frame = new DataFrame();
        frame.addObject(myObject);
        return frame;
    }))
    .via(new CallbackNode((frame: DataFrame) => {

    }))
    .to(new CallbackSinkNode((frame: DataFrame) => {}))
    .build().then((model: Model) => {

    });
```

### Merging frames of the same type
Merging frames of the same type means that you want to merge the information contained within these frames.