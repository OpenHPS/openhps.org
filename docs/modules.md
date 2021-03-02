---
layout: docs.njk
tags: docs
title: 'Modules'
menuOrder: 2
---

# Modules
This page lists the official OpenHPS modules that are available.

## [@openhps/core](/docs/core/)
The core module offers the processing network model and commonly used nodes for sampling absolute and relative positions. It offers 2D, 3D and geographical positioning through trilateration, triangulation, fingerprinting and velocity processing.

## Positioning Algorithms
- **[@openhps/trigonometry](https://github.com/OpenHPS/openhps-trigonometry)** - Adds trigonometry algorithms such as multilateration, trilateration and triangulation.
- **[@openhps/fingerprinting](https://github.com/OpenHPS/openhps-fingerprinting)** - Adds various fingerprinting nodes and services for offline and offline positioning models.
- **[@openhps/opencv](https://github.com/OpenHPS/openhps-opencv)** - Provides linkage with opencv4nodejs and OpenCV.js for computer vision algorithms on the server or browser.

## Abstractions
- **[@openhps/spaces](https://github.com/OpenHPS/openhps-spaces)** - Enables the concept of symbolic spaces (e.g. building, room) on top of reference spaces.

## Data Services
- **[@openhps/mongodb](https://github.com/OpenHPS/openhps-mongodb)** - Adds MongoDB support for the storage of data objects.
- **[@openhps/localstorage](https://github.com/OpenHPS/openhps-localstorage)** - Basic persistent storage for browser based models.

## Communication
- **[@openhps/socket](https://github.com/OpenHPS/openhps-socket)** - Provides node communication through Socket.IO for remote models.
- **[@openhps/rest](https://github.com/OpenHPS/openhps-rest)** - Provides node communication through restful endpoints.

## Misc
- **[@openhps/sphero](https://github.com/OpenHPS/openhps-sphero)** - Example implementation for controlling and receiving sensor data from Sphero toys.
- **[@openhps/react-native](https://github.com/OpenHPS/openhps-react-native)** - Provides nodes for retrieving sensor data in react-native.
- **[@openhps/csv](https://github.com/OpenHPS/openhps-csv)** - Read and write data frames from/to CSV files.