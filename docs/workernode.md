---
layout: docs.njk
tags: docs
title: 'Threading'
menuOrder: 302
---
Data frames and objects are serializable by default through the use of decorators. This allows data to be transmitted between
threads. Threading is supported in OpenHPS through worker nodes and graphs that run one or more nodes in a pool of threads.

## Creating a threaded node with callback
**Master File**
```ts twoslash
import { ModelBuilder, WorkerNode } from '@openhps/core';
import * as path from 'path';

ModelBuilder.create()
    .from()
    .via(
        new WorkerNode(
            (builder) => {
                const { SomeNode } = require(path.join(
                    __dirname,
                    './nodes/SomeNode',
                ));
                builder.via(new SomeNode());
            },
            {
                directory: __dirname,
                poolSize: 1,
            },
        ),
    )
    .to(/* ... */)
    .build();
```

## Creating a threaded node with file
**Master File**
```ts twoslash
import { ModelBuilder, WorkerNode } from '@openhps/core';

ModelBuilder.create()
    .from()
    .via(
        new WorkerNode("./SomeThread.ts",
            {
                directory: __dirname,
                poolSize: 1,
            },
        ),
    )
    .to(/* ... */)
    .build();
```

**Worker File**
```ts twoslash
import { 
    CallbackNode, 
    DataFrame, 
    DataObject, 
    ModelBuilder
} from '@openhps/core';

export default ModelBuilder.create()
    .from()
    .via(new CallbackNode(frame => {
        // Do something time consuming ...
    }))
    .to();
```