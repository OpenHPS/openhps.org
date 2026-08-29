---
layout: docs.njk
tags: docs
title: 'FAQ'
menuOrder: 903
---
## What is OpenHPS?
OpenHPS is an open source framework for building hybrid positioning systems. It fuses multiple positioning techniques and algorithms into a single data processing model, allowing you to go from raw sensor data to a position for one or more objects. Read the [introduction](/docs/introduction/) for more details.

## Do I need to know TypeScript?
The OpenHPS examples are written in TypeScript, but the framework works fine in plain JavaScript. TypeScript simply gives you editor support and type safety.

## Do I need any hardware to try OpenHPS?
No. The [mouse example](/docs/tutorials/mouse/) lets you build your first positioning model using nothing more than your mouse. Hardware-specific examples are available for devices such as smartphones, IMUs or RF beacons.

## Which module do I need?
Start with [@openhps/core](/docs/core/) - it contains the model, nodes and common positioning algorithms. Add more modules only when you need them. See the [modules overview](/docs/modules/) for an overview of the official modules.

## Can OpenHPS run in the browser?
Yes. The [installation page](/docs/installation/) shows how to load OpenHPS from a CDN. Many modules also provide browser builds.

## How does OpenHPS relate to OpenHPS model or WISE?
OpenHPS is developed and maintained at the Web and Information Systems Engineering (WISE) Lab at the Vrije Universiteit Brussel. It is an independent open source project (Apache 2.0).

## How do I cite OpenHPS?
Use the technical paper:
*Van de Wynckel, M. and Signer, B.: "OpenHPS: An Open Source Hybrid Positioning System", Technical Report WISE Lab, WISE-2020-01, December 2020*

## I need help. Where can I ask questions?
Open an issue on the relevant [GitHub repository](https://github.com/OpenHPS) or contact us at info@openhps.org.
