---
layout: docs.njk
tags: docs
title: 'Source Node'
menuOrder: 207
---
A source node is a node that creates or wraps data into data frames. Examples on creating an active or passive source node can be found in the interactive notebook [here](https://observablehq.com/@openhps/openhps-docs-source-nodes).

## Create a passive source
A passive source node is a source that only returns a data frame when it is requested through a pull.

```ts twoslash
// @module: esnext
// @target: es2017
// @strict: false
import { SourceNode, DataFrame, DataObject, PullOptions, SourceNodeOptions } from '@openhps/core';

export class MyPassiveSource<Out extends DataFrame> extends SourceNode<Out> {

    constructor(options?: SourceNodeOptions) {
        super();
    }

    onPull(options?: PullOptions): Promise<Out> {
        return new Promise((resolve, reject) => {
            const object = new DataObject("mysensor");
            const frame = new DataFrame(object);
            resolve(frame as Out);
        });
    }

}
```

## Create an active source
An active source node is a source that automatically creates new data frames (e.g. a sensor that generates information at a fixed interval).

```ts twoslash
// @module: esnext
// @target: es2017
// @strict: false
import { SourceNode, DataFrame, DataObject, PullOptions, SourceNodeOptions } from '@openhps/core';

export class MyActiveSource<Out extends DataFrame> extends SourceNode<Out> {
    private _timer: NodeJS.Timeout = undefined;

    constructor(options?: SourceNodeOptions) {
        super();

        this.once('build', this._initSensor.bind(this));
        this.once('destroy', this._destroySensor.bind(this));
    }

    private _initSensor(): void {
        this._timer = setInterval(() => {
            const object = new DataObject("mysensor");
            const frame = new DataFrame(object);
            this.push(frame as Out);
        }, 1000);
    }

    private _destroySensor(): void {
        clearInterval(this._timer);
    }

    onPull(options?: PullOptions): Promise<Out> {
        return new Promise((resolve, reject) => {
            resolve(undefined);
        });
    }

}
```
