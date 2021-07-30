---
layout: docs.njk
tags: docs
title: 'Installation'
menuOrder: 102
---
## Node.js
If you have [npm installed](https://www.npmjs.com/get-npm), start using @openhps/core with the following command.
```bash
$ npm install @openhps/core --save
```

## Browser
The minified version of our core API is available as a CommonJS UMD module.
```html
<script src="https://cdn.jsdelivr.net/npm/@openhps/core"></script>
```
You can then access the object using ```window['@openhps/core']```.

Alternatively, an ES6 import is supported using:
```javascript
import { ModelBuilder } from 'https://cdn.jsdelivr.net/npm/@openhps/core/dist/web/openhps-core.es.min.js';
```

## Deno
Skypack offers the deno-compatible ESM module. External NPM dependencies are available on skypack as well, allowing a module that works for both node.js and Deno.
```javascript
import { ModelBuilder } from 'https://cdn.skypack.dev/@openhps/core?dts';
```
