---
layout: docs.njk
tags: docs
title: 'Sink Node'
menuOrder: 209
---
A sink node is a *final* node within a process network. By default, it will store data objects contained in data frames that are received by this sink.

## Handling data frames
```ts twoslash
// @strict: false
import { SinkNode, DataFrame, PushOptions } from '@openhps/core';

export class MySink<In extends DataFrame> extends SinkNode<In> {

    onPush(frame: In, options?: PushOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log(frame.source.getPosition());
            resolve();
        });
    }
    
}
```