---
layout: docs.njk
tags: docs
title: 'Installation'
menuOrder: 102
---
OpenHPS runs in Node.js, in the browser, and on Deno. The core module ([@openhps/core](https://www.npmjs.com/package/@openhps/core)) is all you need to get started.

## Node.js
If you have [npm installed](https://www.npmjs.com/get-npm), install the core module.
```bash
$ npm install @openhps/core --save
```

## Browser
The minified version of the core API is available as a CommonJS UMD module.
```html
<script src="https://cdn.jsdelivr.net/npm/@openhps/core"></script>
```
You can then access the object using ```window['@openhps/core']```.

Alternatively, an ES6 import is supported using:
```javascript
import { ModelBuilder } from 'https://cdn.jsdelivr.net/npm/@openhps/core/dist/web/openhps-core.es.min.js';
```

## Deno
Skypack offers the deno-compatible ESM module. External NPM dependencies are available on skypack as well, allowing a module that works for both Node.js and Deno.
```javascript
import { ModelBuilder } from 'https://cdn.skypack.dev/@openhps/core?dts';
```

## Verify your installation
Create a small script that builds a model and confirm it runs without errors.

```js
const { ModelBuilder, CallbackSourceNode, CallbackSinkNode, DataFrame, DataObject } = require('@openhps/core');

const source = new CallbackSourceNode(() => {
    const object = new DataObject("myobject", "My Object");
    return new DataFrame(object);
});

ModelBuilder.create()
    .from(source)
    .to(new CallbackSinkNode((frame) => {
        console.log(`Frame received from ${frame.source.displayName}`);
    }))
    .build()
    .then(async (model) => {
        await source.pull();
        await model.destroy();
    })
    .catch(console.error);
```

If everything works you should see `Frame received from My Object`. Ready to continue? Follow the [mouse example](/docs/tutorials/mouse/) to create your first positioning model.
