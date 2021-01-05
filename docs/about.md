---
layout: docs.njk
tags: docs
title: 'About'
menuOrder: 1
redirect_from:
  - /docs/
---

# About
OpenHPS is an open source hybrid positioning system that allows developers to fuse multiple positioning techniques and algorithms together in a graph topology. It is being developed by PhD Student [Maxim Van de Wynckel](https://wise.vub.ac.be/member/maxim-van-de-wynckel) as part of his research towards *Hybrid Positioning and Implicit Human-Computer Interaction* under the supervision of [Prof. Dr. Beat Signer](https://wise.vub.ac.be/member/beat-signer).

It was created as a positioning framework that can support various different positioning techniques, both during the *online* and *offline* stage.

## Source
Our repositories can be found on GitHub [https://github.com/OpenHPS](https://github.com/OpenHPS)
The CI server containing the compiled components can be found on our CI Server [https://ci.mvdw-software.com/view/OpenHPS/](https://ci.mvdw-software.com/view/OpenHPS/).

## Usage
Get started with OpenHPS by taking a look at the [examples](/docs/examples) or the [getting started](/docs/getting-started) guide.

## Citing & Press Kit
A press kit containing logos (*.SVG, *.PNG) can be found [here](/images/openhps-presskit.zip).
Citing the OpenHPS framework should be done using the technical paper.

## Publications

### OpenHPS: An Open Source Hybrid Positioning System
**Release**: 2020

**Abstract**: Positioning systems and frameworks use various techniques to determine the position of an object. Some of the existing solutions combine different sensory data at the time of positioning in order to compute more accurate positions by reducing the error introduced by the used individual positioning techniques. We present OpenHPS, a generic hybrid positioning system implemented in TypeScript, that can not only reduce the error during tracking by fusing different sensory data based on different algorithms, but also also make use of combined tracking techniques when calibrating or training the system. In addition to a detailed discussion of the architecture, features and implementation of the extensible open source OpenHPS framework, we illustrate the use of our solution in a demonstrator application fusing different positioning techniques. While OpenHPS offers a number of positioning techniques, future extensions might integrate new positioning methods or algorithms and support additional levels of abstraction including symbolic locations.