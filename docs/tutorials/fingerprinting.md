---
layout: docs.njk
tags: docs
title: 'RF Fingerprinting'
menuOrder: 402
---
RF-fingerprinting is a positioning technique that enables the determination of a device's location by comparing the received signal strength (RSS) of different access points. This technique is widely used in indoor positioning systems and can be used to determine the location of a device with high accuracy. The basic idea behind RF-fingerprinting is to create a map of the RSS values at different locations in the environment. This map is then used to determine the location of a device by comparing the RSS values it receives from different access points to the map.

In OpenHPS, fingerprinting requires three parts: (1) a processing node that extracts the fingerprints from the dataframe, (2) a fingerprint service that stores and retrieves the fingerprints, and (3) a fingerprinting algorithm that compares the fingerprints to determine the location of the device.

## Requirements
- [@openhps/core](/docs/core/): The core library of OpenHPS.
- [@openhps/fingerprinting](/docs/fingerprinting/): The fingerprinting library of OpenHPS containing the required service and nodes.

## Example
The following example demonstrates the basic concept of a fingerprinting system in OpenHPS. The example consists of two stages: an offline stage that extracts the fingerprints from the data and stores them in a fingerprint service, and an online stage that uses a KNN algorithm to determine the location of the device based on the fingerprints. The storage of fingerprints happens in-memory, but can be replaced with a database or other storage mechanism.

```ts twoslash
import { 
    ModelBuilder, 
    GraphBuilder, 
    MemoryDataService 
} from '@openhps/core';
import { 
    FingerprintService,         // Pre processes fingerprints
    FingerprintingNode,         // Stores fingerprints
    KNNFingerprintingNode,      // Reverse fingerprinting
    WeightFunction,
    DistanceFunction,
    Fingerprint
} from '@openhps/fingerprinting';

ModelBuilder.create()
    // Add a service with memory storage
    .addService(new FingerprintService(new MemoryDataService(Fingerprint), {
        defaultValue: -95,          // Default RSSI value
        autoUpdate: true            // Automatically preprocess fingerprints
    }))
    .addShape(GraphBuilder.create() // Offline stage
        .from(/* ... */)
        .via(new FingerprintingNode())
        .to(/* ... */))
    .addShape(GraphBuilder.create() // Online stage
        .from(/* ... */)
        .via(new KNNFingerprintingNode({
            k: 3,
            weighted: true,
            weightFunction: WeightFunction.SQUARE,
            similarityFunction: DistanceFunction.EUCLIDEAN
        }))
        .to(/* ... */)) // Output frame with applied position
    .build();
```

The source and sink nodes in this example are left out.
