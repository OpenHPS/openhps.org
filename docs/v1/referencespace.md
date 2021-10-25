---
layout: docs.njk
tags: docs
title: 'Reference Space'
menuOrder: 205
---
Reference spaces are data objects that represent spaces which are used for absolute positions. Using these
reference spaces, absolute positions created in a different space can easily be identified and transformed to the global reference space
created when building a model.

```ts twoslash
// @module: esnext
// @target: es2017
import { ModelBuilder } from '@openhps/core';
const model = await ModelBuilder.create().build();
// ---cut---
import { ReferenceSpace, LengthUnit, AngleUnit } from '@openhps/core';

const refSpace = new ReferenceSpace(model.referenceSpace)
    .referenceUnit(LengthUnit.CENTIMETER)
    .translation(10, 10, 0)
    .scale(1, 1, 0)
    .rotation({ x: 0, y: 0, z: 0, unit: AngleUnit.RADIAN });
```

## Geospatial Places
Geospatial places are supported using the [@openhps/geospatial](/docs/geospatial) module. This module provides the concept of ```SymbolicSpace```s that extend on reference spaces.

```ts twoslash
import { Absolute2DPosition, GeographicalPosition } from '@openhps/core';
import { Building, Floor, Room } from '@openhps/geospatial';

const building = new Building("Pleinlaan 9")
    .setBounds({
        topLeft: new GeographicalPosition(
            50.8203726927966, 4.392241309019189
        ),
        width: 46.275,
        height: 37.27,
        rotation: -34.04
    });
const floor = new Floor("3")
    .setBuilding(building)
    .setFloorNumber(3);
const office = new Room("3.58")
    .setFloor(floor)
    .setBounds([
        new Absolute2DPosition(4.75, 31.25),
        new Absolute2DPosition(8.35, 37.02),
    ]);
const lab = new Room("3.58")
    .setFloor(floor)
    .setBounds([
        new Absolute2DPosition(13.15, 31.25),
        new Absolute2DPosition(25.15, 37.02),
    ]);
```