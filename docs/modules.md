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

## [@openhps/opencv](/docs/opencv)
Our OpenCV module works for both node.js (using opencv4nodejs) and browsers (opencv.js). This offers processing nodes for image processing.

## [@openhps/csv](/docs/csv)
Used for prototyping, the csv component offers simple nodes for loading and saving data from and to CSV files.

## [@openhps/mongodb](/docs/mongodb)
The MongoDB component offers a persistent datastorage for serialised data objects or frames.

## [@openhps/localstorage](/docs/localstorage)
Browser implementations of OpenHPS can make use of the HTML5 localstorage using @openhps/localstorage.

## [@openhps/socket](/docs/socket)
With the Socket API, remote nodes can be added using a websocket connection. This allows bidirectional pulling and pushing of data frames of the HTTP protocol.

## [@openhps/rest](/docs/rest)
The REST API offers automatically created endpoints for remote nodes. These endpoints can be used to push new data frames.

## [@openhps/sphero](/docs/sphero)
Sphero is a brand of educational toys that can be controlled using Bluetooth. This module offers server (using noble) and web support for controlling the Sphero toys and retrieving sensor data.