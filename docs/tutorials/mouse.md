---
layout: docs.njk
tags: docs
title: 'Mouse example'
menuOrder: 403
---

```twoslash include MouseSourceNode
// @filename: MouseSourceNode.ts
import { DataFrame, SourceNode, DataObject, Absolute2DPosition } from '@openhps/core';

export class MouseSourceNode extends SourceNode<DataFrame> {
    private elementId: string = "";
    private trackingArea: HTMLElement = undefined;

    constructor(elementId: string) {
        super();
        this.elementId = elementId;
         this.once('build', this._initMouse.bind(this));
    }
     
    _initMouse() {
        // Get tracking area
        this.trackingArea = document.getElementById(this.elementId);
        this.trackingArea.onmousemove = this.onMouseMove.bind(this);
        this.trackingArea.ontouchmove = this.onTouchMove.bind(this);
    }

    onMouseMove(e: MouseEvent) {
        const rect = this.trackingArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this._emitPosition(x, y);
    }

    onTouchMove(e: TouchEvent) {
        if (e.touches.length > 0) {
            const rect = this.trackingArea.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this._emitPosition(x, y);
        }
    }

    _emitPosition(x: number, y: number) {
        const mouse = new DataObject("mouse");
        mouse.position = new Absolute2DPosition(x, y);
        const frame = new DataFrame(mouse);
        this.push(frame);
    }

    onPull(): Promise<DataFrame> {
        return new Promise((resolve) => {
            resolve(undefined);
        });
    }
}
```


```twoslash include ChartSinkNode
// @filename: ChartSinkNode.ts
import { DataFrame, SinkNode, DataObject, Absolute2DPosition, NodeData, NodeDataService } from '@openhps/core';

export class ChartSinkNode extends SinkNode<DataFrame> {
    private elementId: string = "";
    private chartCanvas: HTMLCanvasElement = undefined;
    private chart: any = undefined;

    constructor(elementId: string) {
        super();
        this.elementId = elementId;
        this.once('build', this._initChart.bind(this));
    }

    _initChart(): void {
        this.chartCanvas = document.getElementById(this.elementId) as HTMLCanvasElement;

        if (!(window as any).Chart) {
            // Load Chart.js if not loaded
            /* @ts-expect-error: Ignore dynamic import error for CDN Chart.js */
            import('https://cdn.jsdelivr.net/npm/chart.js').then(() => this._initChart());
            return;
        }
    }

    onPush(frame): Promise<void> {
        return new Promise((resolve, reject) => {
            // Store and retrieve historical data (supports multiple different object UIDs)
            const service: NodeDataService<any> = this.model.findDataService(NodeData);
            service
                // Find node specific data pertaining to "mouse"
                .findData(this.uid, frame.source)
                .then((data) => {
                    data = data ?? [];
                    data.push({ x: frame.source.position.x, y: frame.source.position.y });
                    // Store node specific data pertaining to "mouse"
                    return service.insertData(this.uid, frame.source, data);
                })
                .then((data) => {
                    // Draw chart with all X,Y locations that passed through this node
                    this.drawChart(data);
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Draw the chart
     * 
     * @params data Array of locations
     */
    drawChart(data: ({x: number, y: number})[]): void {
        const ctx = this.chartCanvas.getContext('2d');
        if (this.chart) this.chart.destroy();
        this.chart = new (window as any).Chart(ctx, {
            type: 'line',
            data: {
                labels: ["location"],
                datasets: [
                    {
                        label: 'Mouse Location',
                        data,
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0,123,255,0.1)',
                        fill: false,
                        showLine: true,
                        pointRadius: 2,
                        parsing: false,
                    }
                ]
            },
            options: {
                animation: false,
                scales: {
                    x: {
                        type: 'linear',
                        min: 0,
                        max: 300,
                        title: { display: true, text: 'X Position' }
                    },
                    y: {
                        type: 'linear',
                        min: 0,
                        max: 200,
                        title: { display: true, text: 'Y Position' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}
```

# `MouseSourceNode`
```ts twoslash
// @showEmit
// @showEmittedFile: MouseSourceNode.js
// @include: MouseSourceNode
```

# `ChartSinkNode`
```ts twoslash
// @showEmit
// @showEmittedFile: ChartSinkNode.js
// @include: ChartSinkNode
```

# Positioning Model

```ts twoslash
// @include: MouseSourceNode
// @include: ChartSinkNode
// ---cut---
// @showEmit
// @showEmittedFile: mouse.js
// @filename: mouse.ts
import { ModelBuilder, DataObject, Absolute2DPosition, SMAFilterNode, ReferenceSpace, Euler, AngleUnit } from '@openhps/core';
import { MouseSourceNode } from './MouseSourceNode';
import { ChartSinkNode } from './ChartSinkNode';

const mouseReferenceSpace = new ReferenceSpace()
    .translation(0, 200)
    .rotation(new Euler(180, 0, 0, 'ZXY', AngleUnit.DEGREE));

ModelBuilder.create()
    // Step 1. Obtain X,Y location from mouse (active source node)
    .from(new MouseSourceNode("trackArea"))
    // Step 2. Flip the axis
    .convertFromSpace(mouseReferenceSpace)
    // Step 3. Simple moving average of the X,Y position (average of 40 readings)
    .via(new SMAFilterNode((obj: DataObject) => ([
            { key: "x", value: (obj.position as Absolute2DPosition).x },
            { key: "y", value: (obj.position as Absolute2DPosition).y }
        ]),
        (key: string, value: number, obj: DataObject) => { obj.position[key] = value },
        { taps: 40 })
    )
    // Step 4. Plot the results
    .to(new ChartSinkNode("mouseChart"))
    .build();
```