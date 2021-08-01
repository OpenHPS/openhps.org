---
layout: docs.njk
tags: docs
title: 'Standard Units'
menuOrder: 203
---
Different units and precisions can be used throughout the framework through the use of the unit API.

## Built-in Units
- **Acceleration units**: Acceleration units used in IMU processing nodes.
- **Angle units**: Angle units needed for orientations or relative angle positions.
- **Angular velocity units**: Angular velocity unit to indicate the angular momentum.
- **Linear velocity units**: Linear velocity unit to indicate the linear momentum.
- **Magnetism units**: Magnetism unit for IMU sensors.
- **Time units**: Time units used to determine when sensor data was created or updated.
- **Length units**: Main unit inside a position. Used to describe a position or distance.

## Creating a new basic unit
Creating a basic unit takes a ```baseName``` and one or more ```definitions```. The base name indicates the type of unit (e.g. length, time, angle or in this case temperature).

```ts twoslash
import { Unit } from '@openhps/core';

const CELCIUS = new Unit("celcius", {
    baseName: "temperature"
});

const FAHRENHEIT = new Unit("fahrenheit", {
    baseName: "temperature",
    definitions: [
        { unit: 'celcius', offset: -32, magnitude: 5 / 9 },
    ]
});

const KELVIN = new Unit("kelvin", {
    baseName: "temperature",
    definitions: [
        { unit: 'celcius', offset: -273.15 },
    ]
});

const RANKINE = new Unit("rankine", {
    baseName: "temperature",
    definitions: [
        { unit: 'kelvin', magnitude: 1 / 1.8 },
    ]
});
```

## Creating a new derived unit
Derived units are units that are comprised of multiple other units. Similar to basic units, the unit has a base name, alias and optional definitions.

```ts twoslash
import { LengthUnit, DerivedUnit, TimeUnit } from '@openhps/core';

const METER_PER_SECOND = new DerivedUnit('meter per second', {
    baseName: 'linearvelocity',
    aliases: ['m/s', 'meters per second'],
})
    .addUnit(LengthUnit.METER, 1)
    .addUnit(TimeUnit.SECOND, -1);

const CENTIMETER_PER_SECOND = METER_PER_SECOND.swap([LengthUnit.CENTIMETER], {
    baseName: 'linearvelocity',
    name: 'centimeter per minute',
    aliases: ['cm/min', 'centimeters per minute'],
});
```