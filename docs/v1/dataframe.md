---
layout: docs.njk
tags: docs
title: 'Data Frame'
menuOrder: 202
---
Data frames are envelopes that are transmitted and processed through a positioning model. These frames are created by source nodes (e.g. sensors) and contain one or more data objects needed to process the frame.

A frame should contain a single reading of a sensor (such as an image of a video stream or current acceleration) and not permanent or calculated information.

![Data frame visualization](/docs/core/media/images/dataframe.svg)

## Creating data frames
OpenHPS is a framework that processes sensor information to retrieve a position for one or more data objects. These objects are contained within an envelope called a data frame.

```ts twoslash
import { DataObject, DataFrame } from '@openhps/core';

const myObject = new DataObject("bsigner", "Beat Signer");
const frame = new DataFrame();
frame.addObject(myObject);
```

A basic data frame supports the addition of objects. Extended versions of this basic data frame also add additional sensor data.

### Adding sensors
```ts twoslash
import { DataFrame, Accelerometer, Acceleration } from '@openhps/core';

const frame = new DataFrame();
// Add an accelerometer sensor with uid "accelerometer" a default acceleration value and a frequency of 50 Hz
frame.addSensor(new Accelerometer("accelerometer", new Acceleration(1, 2, 3), 50));

// ...

// Get any sensor of a specific type
const sensor = frame.getSensor(Accelerometer);
console.log(`${sensor.value.x}, ${sensor.value.y}, ${sensor.value.z}`); 
// Expected output: 1, 2, 3
```

## Creating a custom data frame
Similar to data objects, decorators have to be used to indicate a serializable data frame.

```ts twoslash
// @experimentalDecorators: true
import { 
    DataFrame,
    SerializableObject,
    SerializableMember
} from '@openhps/core';

@SerializableObject()
export class QRDataFrame extends DataFrame {
    public rawImage: any = undefined;
}
```