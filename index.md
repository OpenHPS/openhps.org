---
layout: home.njk
title: 'Home'
---
<div class="row lead">
    <p class="col-sm-6">
        OpenHPS is an open source hybrid positioning system to help developers fuse various positioning technologies and algorithms. The system offers a modular data processing framework with each modules ranging from computer vision to common algorithms such as fingerprinting or data persistence of sampled data.
    </p>
    <p class="col-sm-6">
        The framework is maintained and used by the Web and Information Systems Engineering Lab at the Vrije Universiteit Brussel. <a href="/docs/about">Read more...</a>
    </p>
</div>

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
