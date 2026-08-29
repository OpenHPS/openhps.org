---
layout: docs.njk
tags: docs
title: 'Positioning Model'
menuOrder: 201
---
A positioning model is a processing network with a graph topology that samples sensor data and produces a position as output. You define it with the `ModelBuilder`, adding **nodes**, **shapes** and **services**:

- `SourceNode`s push data frames into the model.
- `ProcessingNode`s transform the data.
- `SinkNode`s store or finalize data frames.

## Creating a positioning model
The `ModelBuilder` lets you chain nodes from source to processing node to sink using a fluent API.

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
        const frame = new DataFrame(myObject);
        return frame;
    }))
    .via(new CallbackNode((frame: DataFrame) => {
        // Process the frame (e.g. compute a position)
    }))
    .to(new CallbackSinkNode((frame: DataFrame) => {
        // Store or display the result
    }))
    .build().then((model: Model) => {
        // The model is now ready to be used
    });
```

Instead of extending the base `Node` class, most models extend a `SourceNode`, `ProcessingNode` or `SinkNode`. See the [source node](/docs/sourcenode/), [processing node](/docs/processingnode/) and [sink node](/docs/sinknode/) pages for more details.

## Merging data frames
OpenHPS supports merging multiple sources of data frames in different ways.

### Merging streams of data frames
Pass multiple source nodes to `from()` to merge their streams. Every frame that reaches a node is processed independently.
```ts twoslash
// @alwaysStrict: false
import { 
    ModelBuilder,
    CallbackSourceNode,
    CallbackSinkNode,
    CallbackNode,
    DataFrame,
    DataObject
} from '@openhps/core';

ModelBuilder.create()
    .from(new CallbackSourceNode(() => {
        const frame = new DataFrame(new DataObject("object-a"));
        return frame;
    }), new CallbackSourceNode(() => {
        const frame = new DataFrame(new DataObject("object-b"));
        return frame;
    }))
    .via(new CallbackNode((frame: DataFrame) => {
        // Process each frame independently
    }))
    .to(new CallbackSinkNode(() => {}))
    .build();
```

### Merging frames of the same type
You can also merge the information contained within multiple frames of the same type, for example to combine sensor readings in a single frame. See the [data frame](/docs/dataframe/) page for more information on how frames can be combined.
