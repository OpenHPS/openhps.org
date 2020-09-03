---
layout: 'docs'
title: 'Examples'
menuOrder: 3
---
# Examples
This documentation page provides several examples to get started.

### Web-based pedometer
This example shows how you can use a Web API to get motion data. This data is processed
to get the amount of steps.
```typescript
import { ModelBuilder } from '@openhps/core';
import { IMUDataFrame, MotionBrowserSource, PedometerProcessingNode } from '@openhps/imu';

ModelBuilder.create()
    // Source node that uses the HTML5 Gyroscope API
    .from(new MotionBrowserSource())
    // Processing node that converts the gyroscope data to steps
    .via(new PedometerProcessingNode())
    // The source node (pedometer), will contain the total step count
    // The sink node also saves the source allowing the incrementation of steps
    .to(new LoggingSinkNode((frame: IMUDataFrame) => {
        console.log((frame.source as PedometerObject).stepCount);
    }))
    .build();
```