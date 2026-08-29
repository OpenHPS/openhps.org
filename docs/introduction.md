---
layout: docs.njk
tags: docs
title: 'Introduction'
menuOrder: 101
redirect_from:
  - /docs/
  - /docs/about/
  - /docs/getting-started/
  - /getting-started/
---
OpenHPS is an open source framework for building positioning systems. It lets you fuse multiple positioning techniques and algorithms into a single *data processing model*, so you can go from raw sensor data to a position for one or more objects.

The project is led by [Maxim Van de Wynckel](https://maximvdw.be) as part of his research towards *Interoperable and Discoverable Indoor Positioning Systems*, supervised by [Prof. Dr. Beat Signer](https://beatsigner.com).

## How it works

At its core, OpenHPS is a graph of connected **nodes** that process information. Information flows through the graph as **data frames**, which carry one or more **data objects** (the things you are locating).

![Architectural Overview](/images/docs/architecture.svg)

There are three types of nodes:
- **Source nodes** generate new data frames (e.g. from a sensor).
- **Processing nodes** transform the data (e.g. a positioning algorithm).
- **Sink nodes** store or display the result.

## Features
- 2D, 3D and geographical positioning
- Relative positioning (e.g. distance or angle to a landmark)
- Common algorithms out of the box: trilateration, triangulation, fingerprinting, dead reckoning and more
- Computer vision through [@openhps/opencv](/docs/opencv/)
- Extensible: add your own nodes, algorithms and data services
- Modular: [pick only the modules you need](/docs/modules/)

## What's next?
- [Install OpenHPS](/docs/installation/) (Node.js or browser)
- Follow the [mouse example](/docs/tutorials/mouse/) to build your first positioning model
- Learn the [core concepts](/docs/model/) such as the positioning model, data objects and data frames

## Source
All code is available on [GitHub](https://github.com/OpenHPS) and published on [npm](https://www.npmjs.com/org/openhps). 

## Citing & Press Kit
A press kit containing logos (*.SVG, *.PNG) can be found [here](/media/openhps-presskit.zip). Citing the OpenHPS framework should be done using the technical paper.

*Van de Wynckel, M. and Signer, B.: "OpenHPS: An Open Source Hybrid Positioning System", Technical Report WISE Lab, WISE-2020-01, December 2020*
