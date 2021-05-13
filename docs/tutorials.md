---
layout: docs.njk
tags: docs
title: 'Tutorials'
menuOrder: 4
---

# Tutorial 1: Basics
In this tutorial you will explore the basics of OpenHPS.

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
    .via(new CallbackNode((frame: DataFrame) => {

    }))
    .to(new CallbackSinkNode((frame: DataFrame) => {

    }))
    .build().then((model: Model) => {

    });
```

# Tutorial 2: Absolute and Relative Position

# Tutorial 3: Custom Data Types
Depending on what type of positioning system you are creating, you may find yourself
having to add data to data frames or data objects that do not exist yet.