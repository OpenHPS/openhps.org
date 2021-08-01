---
layout: docs.njk
tags: docs
title: 'Reference Space'
menuOrder: 206
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