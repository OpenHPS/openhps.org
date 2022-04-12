<h1 align="center">
  <img alt="OpenHPS" src="https://openhps.org/images/logo_text-512.png" width="40%" /><br />
  www.openhps.org
</h1>
<p align="center">
    <a href="https://app.netlify.com/sites/openhps/deploys" target="_blank">
        <img alt="Netlify build Status" src="https://api.netlify.com/api/v1/badges/cd5b79e8-3390-4644-9c46-713285941835/deploy-status">
    </a>
    <a href="https://github.com/OpenHPS/openhps.org/actions/workflows/main.yml" target="_blank">
        <img alt="GitHub build Status" src="https://github.com/OpenHPS/openhps.org/actions/workflows/main.yml/badge.svg">
    </a>
</p>

<br />

This repository contains the website for OpenHPS (Open Source Hybrid Positioning System) on the domain https://openhps.org. It contains
the following information:
- General documentation
- API documentation (Typedoc)
- Presentations for lectures and conferences
- Publications and resources
- Ontologies documentation

## Installation
Start by installing all dependencies.
```bash
$ npm install
```

Build the eleventy site using the build script.
```bash
$ npm run build
```

Optionally, the ```--serve``` tag can be used to host a development version of the site.
```bash
npm run build -- --serve
```

## Deployment
Deployment is done on Netlify

## Contributing
Use of OpenHPS, contributions and feedback is highly appreciated. Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License
Copyright (C) 2019-2022 Maxim Van de Wynckel & Vrije Universiteit Brussel

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.