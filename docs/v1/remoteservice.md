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

```ts twoslash
import { RemoteService, DataFrame, PushOptions, PullOptions } from '@openhps/core';

export class MyRemoteClient extends RemoteService {
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
