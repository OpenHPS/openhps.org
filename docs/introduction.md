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
OpenHPS is an open source hybrid positioning system that allows developers to fuse multiple positioning techniques and algorithms together in a graph topology. The project is led by PhD candidate [Maxim Van de Wynckel](https://wise.vub.ac.be/member/maxim-van-de-wynckel) as part of his research towards *Hybrid Positioning and Implicit Human-Computer Interaction* under the supervision of [Prof. Dr. Beat Signer](https://wise.vub.ac.be/member/beat-signer).

It was created as a positioning framework that can support various different positioning techniques, both during the *online* and *offline* stage.

## Features
- 2D, 3D and geographical positioning
- Relative positioning.
- Basic positioning algorithms (e.g. trilateration, triangulation, fingerprinting, dead reckoning...)
- Advanced positioning algorithms (e.g. computer vision through @openhps/opencv)
- Extremely extensible.
- Open source.

## Framework Architecture
OpenHPS is a open source hybrid positioning system that allows developers to fuse multiple positioning techniques and algorithms together in a graph topology. It is being developed by PhD Student [Maxim Van de Wynckel](https://wise.vub.ac.be/member/maxim-van-de-wynckel) as part of his research towards *Hybrid Positioning and Implicit Human-Computer Interaction* under the supervision of [Prof. Dr. Beat Signer](https://wise.vub.ac.be/member/beat-signer).

The core *Model* of OpenHPS is a data processing network aimed for sampling input sensory data to an output position.

![Architectural Overview](/images/docs/architecture.svg)

A model represents a graph topology where each node contributes to the processing of information. This information is encapsulated in *data frames* that hold information of multiple *data objects*. Three types of nodes are identified:
- **Source nodes**: Generate new data frames for the downstream node(s).
- **Processing nodes**: Process the information generated by source node(s).
- **Sink nodes**: Store or display the information generated by source nodes and processed by others.

Our core API provides generic nodes that can help process the most common sensory data (e.g. filter nodes, common graph shapes, merging, basic positioning algorithms). However, the extensible API also allows developers to create their own nodes.

Data frames hold information about the source that generated the information and any object that is included in the sensory data. This can range from objects that are identified by their MAC address to more abstract objects such as the map of a room. Objects inside this frame can have an absolute position, multiple relative positions and a potential parent object (e.g. the sensor of a phone has the phone as the parent object).

Each node has access to services. These services can hold information about previous positions of object or calibration data. External data services can be added to transfer data generated during the set up of the positioning system to the online stage.

More in-depth information can be found in the [core API description](/docs/core) ...

## Modularity
OpenHPS is split up into multiple modules that each offer a certain set of functionalities. The core API (@openhps/core) offers the processing model and commonly used nodes for sampling absolute and relative positions. Various additions such as *@openhps/socket*, *@openhps/rest* or *@openhps/mongodb* can be added to extend the framework with remote graph nodes or persistent data store.

![OpenHPS Stack](/images/docs/openhps-stack.svg)

## Source
Our repositories can be found on GitHub [https://github.com/OpenHPS](https://github.com/OpenHPS). The distributed NPM packages can be found under the OpenHPS organisation [https://www.npmjs.com/org/openhps](https://www.npmjs.com/org/openhps). 

## Citing & Press Kit
A press kit containing logos (*.SVG, *.PNG) can be found [here](/media/openhps-presskit.zip).
Citing the OpenHPS framework should be done using the technical paper.

*Van de Wynckel, M. and Signer, B.: "OpenHPS: An Open Source Hybrid Positioning System", Technical Report WISE Lab, WISE-2020-01, December 2020*