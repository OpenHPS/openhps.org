---
layout: docs.njk
tags: docs
title: 'Positioning Model'
menuOrder: 203
---
A positioning model is a process network with graph topology, aimed to sample sensor data to an output position. In the ```ModelBuilder``` you can add nodes, shapes and services. ```SourceNode```s push data frames, ```SinkNode```s store an finalize data frames and ```ProcessingNode```s process the data frame and its contents.

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
    .via(new CallbackNode((frame: DataFrame | DataFrame[]) => {

    }))
    .to(new CallbackSinkNode((frame: DataFrame | DataFrame[]) => {

    }))
    .build().then((model: Model) => {

    });
```