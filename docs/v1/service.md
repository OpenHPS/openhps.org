---
layout: docs.njk
title: 'Services'
tags: docs
menuOrder: 210
---

## Types of services
- ```DataService```: A data service is meant to store serializable data. It can be accessed by any node in the model and takes a [DataServiceDriver](/docs/core/classes/DataServiceDriver.html).
    - ```DataObjectService```: A data service for handling data objects. Every positioning model includes an in-memory data object service.
    - ```DataFrameService```: A data service for handling data frames.
    - ```NodeDataService```: A data service that stores temporary node data such as intermediate processing results.
    - ```TrajectoryService```: A data service that appends the processed position of a data object to a trajectory.
- ```RemoteNodeService```: The remote node service allows the registration of [remote nodes](/docs/core/classes/remotenode.html).
- ```TimeService```: A time service can be accessed by every node to retrieve the current time. It can be used to synchronize the time with multiple systems.
- ```LocationBasedService```: A developer friendly service for pulling or watching for position changes.