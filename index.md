---
layout: home.njk
title: 'Home'
---
## Quick Start
If you have [npm installed](https://www.npmjs.com/get-npm), start using @openhps/core with the following commands.
```bash
$ npm install @openhps/core --save
```

Then you can start by importing the model builder to create your first positioning model.

```ts twoslash
import { ModelBuilder } from '@openhps/core';
ModelBuilder.create()
    .from(/* ... */)
    .via(/* ... */)
    .to(/* ... */)
    .build();
```
