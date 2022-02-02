---
layout: docs.njk
tags: docs
title: 'Building and Floor Detection'
menuOrder: 401
---
Building and floor detection is required whenever you are working with an indoor positiong system that covers multiple buildings and floors. 

## Filtering Sensor Data
The general idea behind building or floor detection is to determine the plausible general location. One way to do this is
to create a filter that removes relative positions that are not relevant.

```ts twoslash
// @experimentalDecorators: true
import { DataFrame, DataObject, RelativeDistance, RelativePositionProcessing } from "@openhps/core";

export class RelativePositionFilter<InOut extends DataFrame> 
    extends RelativePositionProcessing<InOut, RelativeDistance> {
    processRelativePositions(
        dataObject: DataObject,
        relativePositions: Map<RelativeDistance, DataObject>,
        dataFrame?: InOut,
    ): Promise<DataObject> {
        return new Promise((resolve, reject) => {
            
        });
    }
}
```
