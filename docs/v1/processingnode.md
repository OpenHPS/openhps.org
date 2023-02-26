---
layout: docs.njk
tags: docs
title: 'Processing Node'
menuOrder: 208
---
A processing node converts the data inside a data frame to an output position of its data object(s).

## Create a frame processing node
With the normal processing node you can process a data frame. By overriding the ```process()``` function you can
manipulate any data frame pushed to the node.

```ts twoslash
// @strict: false
import { ProcessingNode, DataFrame, PushOptions } from '@openhps/core';

export class MyProcessingNode<
    In extends DataFrame,
    Out extends DataFrame> extends ProcessingNode<In, Out> {

    process(frame: In, options?: PushOptions): Promise<Out> {
        return new Promise((resolve, reject) => {
            resolve(frame as unknown as Out);
        });
    }

}
```

## Create an object processing node
In some cases you are interested in manipulating objects inside a data frame, rather than the complete data frame itself. An ```ObjectProcessingNode``` extends a ```ProcessingNode``` with a ```processObject()``` function that is called for every object inside a data frame.
```ts twoslash
// @strict: false
import { ObjectProcessingNode, DataFrame, DataObject, PushOptions } from '@openhps/core';

export class MyObjectProcessingNode<InOut extends DataFrame> extends ObjectProcessingNode<InOut> {

    processObject(object: DataObject, frame?: InOut, options?: PushOptions): Promise<DataObject> {
        return new Promise((resolve, reject) => {
            resolve(object);
        });
    }

}
```

## Create a processing node for multiple inlets
In the previous examples we assumed that only one type of data frame was provided to the processing node. Processing data from multiple inlets is possible. An example could be a processing node that requires both IMU and Video data to process information. Depending on the relation between the data frames, different implementations are possible.

### Conditional processing
With conditional processing we have a processing node that is capable of processing different types or data from different nodes.

**Example of conditional processing on frame type**
```ts twoslash
// @strict: false
import { ProcessingNode, DataFrame, PushOptions } from '@openhps/core';
import { VideoFrame, DepthVideoFrame } from '@openhps/video';

export class MyProcessingNode<
    In extends DataFrame,
    Out extends DataFrame> extends ProcessingNode<In, Out> {
    
    process(frame: In, options?: PushOptions): Promise<Out> {
        return new Promise((resolve, reject) => {
            if (frame instanceof VideoFrame) {
                // Video data frame processing
            } else if (frame instanceof DepthVideoFrame) {
                // Depth video data frame processing
            }
            resolve(frame as unknown as Out);
        });
    }

}
```

**Example of conditional processing on inlet node**
```ts twoslash
// @strict: false
import { ProcessingNode, DataFrame, PushOptions } from '@openhps/core';

export class MyProcessingNode<
    In extends DataFrame,
    Out extends DataFrame> extends ProcessingNode<In, Out> {

    process(frame: In, options?: PushOptions): Promise<Out> {
        return new Promise((resolve, reject) => {
            const lastNode = this.model.findNodeByUID(options.lastNode);
            if (lastNode.name === "A") {
                // Process if last node is "A"
            } else if (lastNode.name === "B") {
                // Process if last node is "B"
            }
            resolve(frame as unknown as Out);
        });
    }

}
```