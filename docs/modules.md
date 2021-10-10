---
layout: docs.njk
tags: docs
title: 'Modules'
menuOrder: 103
---
This page gives an overview of the official OpenHPS modules that are available. This list does not contain third party modules that provide nodes or data services.

## [@openhps/core](/docs/core/)
The core module offers the processing network model and commonly used nodes for sampling absolute and relative positions. It offers 2D, 3D and geographical positioning through trilateration, triangulation, fingerprinting and velocity processing.

## Positioning Algorithms
- **[@openhps/imu](/docs/imu)** - Adds IMU processing nodes for fusing IMU sensors.
- **[@openhps/fingerprinting](/docs/fingerprinting)** - Adds various fingerprinting nodes and services for offline and offline positioning models.
- **[@openhps/opencv](/docs/opencv)** - Provides binding with opencv4nodejs and OpenCV.js for computer vision algorithms on the server or browser.
- **[@openhps/openvslam](/docs/openvslam)** - Provides bindings to OpenVSLAM for Visual Simultaneous Localization and Mapping.

## Abstractions
- **[@openhps/spaces](/docs/spaces)** - Enables the concept of symbolic spaces (e.g. building, room) on top of reference spaces.

## Data Services
- **[@openhps/mongodb](/docs/mongodb)** - Adds MongoDB support for the storage of data objects.
- **[@openhps/localstorage](/docs/localstorage)** - Basic persistent storage for browser based models.

## Communication
- **[@openhps/socket](/docs/storage)** - Provides node communication through Socket.IO for remote models.
- **[@openhps/rest](/docs/rest)** - Provides node communication through restful endpoints.
- **[@openhps/mqtt](/docs/mqtt)** - MQTT client node communication and standalone MQTT server.

## Misc
- **[@openhps/sphero](/docs/sphero)** - Example implementation for controlling and receiving sensor data from Sphero toys.
- **[@openhps/react-native](/docs/react-native)** - Provides nodes for retrieving sensor data in react-native.
- **[@openhps/csv](/docs/csv)** - Read and write data frames from/to CSV files.