---
layout: docs.njk
tags: docs
title: 'Remote Service'
menuOrder: 301
---
A remote service is an API for enabling remote communication of nodes and services.

## Create a remote service
When creating a new remote service, you have to implement all remote method calls:
- ```remotePush(...)```: Called when a data frame should be pushed to a remote node.
- ```remotePull(...)```: Called when a pull is made to a remote node.
- ```remoteEvent(...)```: Called when an event should be forwarded to a remote node.
- ```remoteServiceCall(...)```: Called when a method call is made to a remote service proxy.
These are the calls to *send* data to a remote server.

Receiving data should be done manually by calling the following functions:
- ```localPush(...)```: Push data to a local node.
- ```localPull(...)```: Pull data from a local node.
- ```localEvent(...)```: Send an event to a local node.
- ```localServiceCall(...)```: Send a method call to a local service.
These are the calls to our own OpenHPS model and services.

```ts twoslash
import { RemoteService, DataFrame, PushOptions, PullOptions } from '@openhps/core';

export class MyRemoteClient extends RemoteService {

    constructor() {
        super();
        this.once('build', this.initialize.bind(this));
    }
    
    protected initialize(): Promise<void> {
        return new Promise((resolve) => {
            // Do local calls
        });
    }

    /**
     * Send a push to a specific remote node
     *
     * @param {string} uid Remote Node UID
     * @param {DataFrame} frame Data frame to push
     * @param {PushOptions} [options] Push options
     */
     public remotePush<T extends DataFrame | DataFrame[]>(
        uid: string,
        frame: T,
        options?: PushOptions,
    ): Promise<void> {
        return new Promise((resolve, reject) => {

        });
    }

    /**
     * Send a pull request to a specific remote node
     *
     * @param {string} uid Remote Node UID
     * @param {PullOptions} [options] Pull options
     */
    public remotePull(uid: string, options?: PullOptions): Promise<void> {
        return new Promise((resolve, reject) => {

        });
    }

    /**
     * Send an error to a remote node
     *
     * @param {string} uid Remote Node UID
     * @param {string} event Event to send
     * @param {any} arg Event argument
     */
    public remoteEvent(uid: string, event: string, ...args: any[]): Promise<void> {
        return new Promise((resolve) => {

        });
    }

    /**
     * Send a remote service call
     *
     * @param {string} uid Service uid
     * @param {string} method Method to call 
     * @param {any[]} args Optional set of arguments 
     */
    public remoteServiceCall(uid: string, method: string, ...args: any[]): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }
}
```

### Example Broker
We create a dummy broker that is just an event emitter that can be listened to. This dummy broker represents a server.

```twoslash include dummybroker
const EventEmitter: any = {};
// ---cut---

export class DummyBroker extends EventEmitter {
    static instance: DummyBroker;

    constructor() {
        super();
        DummyBroker.instance = this;
    }
}
```
```ts twoslash
// @include: dummybroker
```
Next we create a client that listens for events on this broker. Whenever a push, pull, event or service
is received - we will perform a local action.

```ts twoslash
// @include: dummybroker
// ---cut---
import { DataFrame, DataSerializer, Node, PullOptions, PushOptions, RemoteService } from "@openhps/core";

export class DummyClient extends RemoteService {
    constructor() {
        super();
        this.once('build', this.initialize.bind(this));
    }
    
    protected initialize(): Promise<void> {
        return new Promise((resolve) => {
            DummyBroker.instance.on("push", (sender, uid, data) => {   
                if (sender === this.constructor.name)
                    return;
                this.localPush(uid, DataSerializer.deserialize(data.frame), data.options);
            });
            DummyBroker.instance.on('pull', (sender, uid, options) => {
                if (sender === this.constructor.name)
                    return;
                this.localPull(uid, options);
            });
            DummyBroker.instance.on('event', (sender, uid, event, ...args) => {
                if (sender === this.constructor.name)
                    return;
                this.localEvent(uid, event, ...args);
            });
            DummyBroker.instance.on('service', (sender, uuid, uid, method, ...args) => {
                if (sender === this.constructor.name)
                    return;
                Promise.resolve(this.localServiceCall(uid, method, ...args)).then(data => {
                    DummyBroker.instance.emit('service-response', this.constructor.name, uuid, data);
                });
            });
            DummyBroker.instance.on('service-response', (sender, uuid, data) => {
                if (sender === this.constructor.name)
                    return;
                this.getPromise(uuid).resolve(data);
            });
            resolve();
        });
    }

    remotePush<T extends DataFrame | DataFrame[]>(
        uid: string,
        frame: T,
        options?: PushOptions,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                DummyBroker.instance.emit("push", this.constructor.name, uid, {
                    frame: DataSerializer.serialize(frame),
                    options
                });
                resolve();
            } catch (ex) {
                reject(ex);
            }
        });
    }

    remotePull(uid: string, options?: PullOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                DummyBroker.instance.emit("pull", this.constructor.name, uid, {
                    options
                });
                resolve();
            } catch (ex) {
                reject(ex);
            }
        });
    }

    remoteEvent(uid: string, event: string, ...args: any[]): Promise<void> {
        return new Promise((resolve) => {
            DummyBroker.instance.emit("event", this.constructor.name, uid, event, ...args);
            resolve();
        });
    }

    remoteServiceCall(uid: string, method: string, ...args: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const uuid = this.registerPromise(resolve, reject);
            DummyBroker.instance.emit("service", this.constructor.name, uuid, uid, method, ...args);
        });
    }
}
```