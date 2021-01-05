---
layout: home.njk
title: 'Home'
---
<p class="lead">
OpenHPS is an open source hybrid positioning system to help developers fuse various positioning technologies and algorithms. The system offers a modular data processing framework with each modules ranging from computervision to common algorithms such as fingerprinting or data persistence of sampled data.
</p>

## Quick Start
If you have [npm installed](https://www.npmjs.com/get-npm), start using @openhps/core with the following commands.
```bash
$ npm install @openhps/core --save
```

Then you can start by importing the model builder to create your first positioning model.

```typescript
import { ModelBuilder } from '@openhps/core';
ModelBuilder.create()
    .from(/* ... */)
    .via(/* ... */)
    .to(/* ... */)
    .build();
```