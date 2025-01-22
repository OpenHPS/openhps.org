---
layout: docs.njk
title: 'Services'
tags: docs
menuOrder: 210
---
```mermaid
classDiagram


class CalibrationService~T~{
            #node
            +calibrate()*
#start()
#stop()
#suspend()
        }
DataObjectService~T~<|--CalibrationService~T~
class DataFrameService~T~{
            
            +insertFrame()
+findBefore()
+findAfter()
+findByDataObject()
-_findTimestamp()
        }
DataService~I,T~<|--DataFrameService~T~
class DataObjectService~T~{
            
            +insertObject()
+insert()
+findByDisplayName()
+findByPosition()
+findByParentUID()
+findBefore()
+findAfter()
-_findTimestamp()
        }
DataService~I,T~<|--DataObjectService~T~
class DataService~I,T~{
            #driver
+priority
            -_buildDriver()
-_destroyDriver()
+setPriority()
+findByUID()
+findOne()
+findAll()
+insert()
+count()
+delete()
+deleteAll()
        }
Service<|--DataService~I,T~
class DataServiceDriver~I,T~{
            +dataType
#options
            +findByUID()*
+findOne()*
+findAll()*
+count()*
+insert()*
+delete()*
+deleteAll()*
        }
class DataServiceOptions~T~ {
            <<interface>>
            +serialize
+deserialize
+keepChangelog
            
        }
Service<|--DataServiceDriver~I,T~
ServiceOptions<|..DataServiceOptions~T~
class QuerySelector~T~ {
            <<interface>>
            +$eq
+$gt
+$gte
+$lt
+$lte
+$in
+$nin
+$elemMatch
            
        }
class RootQuerySelector~T~ {
            <<interface>>
            +$and
+$or
            
        }
class FindOptions {
            <<interface>>
            +dataType
+limit
+sort
            
        }
class MemoryDataService~I,T~{
            #_data
            +findByUID()
+findOne()
+findAll()
+insert()
+delete()
+count()
+deleteAll()
        }
DataServiceDriver~I,T~<|--MemoryDataService~I,T~
class MemoryQueryEvaluator{
            
            -isRegexQuery()$
+evaluateComponent()$
+evaluate()$
+getValueFromPath()$
#evaluatePath()$
#evaluateSelector()$
#evaluateComparisonSelector()$
#evaluateArraySelector()$
#evaluateOp()$
        }
class RemoteService{
            #nodes
#localServices
#remoteServices
#promises
+model
            -_registerServices()
#registerPromise()
#getPromise()
+localPush()
+localPull()
+localEvent()
+localServiceCall()
+remotePush()*
+remotePull()*
+remoteEvent()*
+remoteServiceCall()*
+registerNode()
+registerService()
        }
class RemoteServiceProxy~T,S~{
            #options
#service
            +get()
+set()
+createHandler()
        }
class RemoteServiceOptions {
            <<interface>>
            +uid
+service
            
        }
class RemotePullOptions {
            <<interface>>
            +clientId
            
        }
class RemotePushOptions {
            <<interface>>
            +clientId
+broadcast
            
        }
Service<|--RemoteService
Service<|--RemoteServiceProxy~T,S~
ProxyHandler~T~<|..RemoteServiceProxy~T,S~
PullOptions<|..RemotePullOptions
PushOptions<|..RemotePushOptions
RemoteServiceProxy~T,S~  --  RemoteServiceOptions
class Service{
            +uid
-_ready
+model
+dependencies
            +addDependency()
#generateUUID()
+setUID()
+isReady()
+emit()
+once()
+logger()
        }
class ServiceOptions {
            <<interface>>
            +uid
            
        }
AsyncEventEmitter<|--Service
class TrajectoryService~T~{
            +model
#options
            -_bindService()
+findCurrentTrajectory()
+findTrajectoryByRange()
+findTrajectories()
+appendPosition()
        }
class TrajectoryServiceOptions {
            <<interface>>
            +dataService
+autoBind
+defaultUID
            
        }
DataService~I,T~<|--TrajectoryService~T~
DataServiceOptions~T~<|..TrajectoryServiceOptions
TrajectoryService~T~  --  TrajectoryServiceOptions
class WorkerServiceProxy{
            #options
-_promises
            -_onOutput()
+get()
+createHandler()
        }
class WorkerServiceCall {
            <<interface>>
            +id
+serviceUID
+method
+parameters
            
        }
class WorkerServiceResponse {
            <<interface>>
            +id
+success
+result
            
        }
ServiceProxy~S~<|--WorkerServiceProxy
```

## Types of services
- ```DataServiceDriver```: A data service driver is storage interface for any data service.
- ```DataService```: A data service is meant to store serializable data. It can be accessed by any node in the model and takes a [DataServiceDriver](/docs/core/classes/DataServiceDriver.html).
    - ```DataObjectService```: A data service for handling data objects. Every positioning model includes an in-memory data object service.
    - ```DataFrameService```: A data service for handling data frames.
    - ```NodeDataService```: A data service that stores temporary node data such as intermediate processing results.
    - ```TrajectoryService```: A data service that appends the processed position of a data object to a trajectory.
- ```RemoteNodeService```: The remote node service allows the registration of [remote nodes](/docs/core/classes/remotenode.html).
- ```TimeService```: A time service can be accessed by every node to retrieve the current time. It can be used to synchronize the time with multiple systems.
- ```LocationBasedService```: A developer friendly service for pulling or watching for position changes.

## ``DataServiceDriver``
A data service driver is a database storage interface for storing any serializable object (that is any object using the ```@SerializableObject()``` decorator) with any type of identifier.

The driver should implement the following methods:
- ```findByUID(id: I): Promise<T>```: Find the data by a UID.
- ```findOne(query?: FilterQuery<T>, options?: FindOptions): Promise<T>```: Find one item based on an optional query.
- ```findAll(query?: FilterQuery<T>, options?: FindOptions): Promise<T[]>```: Find all items based on an optional query.
- ```count(query?: FilterQuery<T>): Promise<number>```: Count all items.
- ```insert(id: I, object: T): Promise<T>```: Insert a new item.
- ```delete(id: I): Promise<void>```: Delete an item.
- ```deleteAll(query?: FilterQuery<T>): Promise<void>```: Delete all items. 
The methods are similar to the [Node.js MongoDB API](https://mongodb.github.io/node-mongodb-native/4.1/classes/Collection.html) but with more limited features that would still allow other drivers other than MongoDB.

## ``LocationBasedService``
A location-based service is a developer friendly service for retrieving a location of an object.