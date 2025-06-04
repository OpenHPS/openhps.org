---
layout: home.njk
title: 'Home'
---

<div class="row lead">
    <p class="col-sm-6">
        OpenHPS is an open source hybrid positioning system to help developers fuse various positioning technologies and algorithms. The system offers a modular data processing framework with each modules ranging from computer vision to common algorithms such as fingerprinting or data persistence of sampled data.
    </p>
    <p class="col-sm-6">
        The framework is maintained and used by the Web and Information Systems Engineering Lab at the Vrije Universiteit Brussel. <a href="/docs/about">Read more...</a>
    </p>
</div>

## Quick Start
If you have [npm installed](https://www.npmjs.com/get-npm), start using @openhps/core with the following commands.
```bash
$ npm install @openhps/core --save
```


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

Then you can start by importing the model builder to create your first positioning model.
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
    .from(new MouseSourceNode("trackArea"))
    .convertFromSpace(mouseReferenceSpace)
    .via(new SMAFilterNode((obj: DataObject) => ([
            { key: "x", value: (obj.position as Absolute2DPosition).x },
            { key: "y", value: (obj.position as Absolute2DPosition).y }
        ]),
        (key: string, value: number, obj: DataObject) => { obj.position[key] = value },
        { taps: 40 })
    )
    .to(new ChartSinkNode("mouseChart"))
    .build();
```

<style>
.btn-header.code {
    margin-top: 1em;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
}

#mouseModal {
    display: none; 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100vw; 
    height: 100vh; 
    background: rgba(0,0,0,0.5); 
    z-index: 1000; 
    align-items: center; 
    justify-content: center;
}

#mouseModal div.container {
    background: #fff; 
    padding: 1.5em; 
    border-radius: 8px; 
    min-width: 320px; 
    min-height: 280px; 
    max-width: 360px;
    max-height: 90vh;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#trackArea {
    width: 100%; 
    max-width: 300px; 
    height: 180px;
    border: 2px solid #007bff; 
    margin-bottom: 1em; 
    position: relative; 
    background: #f8f9fa;
    box-sizing: border-box;
}

#mouseChart {
    width: 100% !important;
    max-width: 300px;
    height: 156px;
}

@media (max-width: 600px) {
    #mouseModal div.container {
        padding: 1em;
        min-width: 0;
        min-height: 0;
        max-width: 98vw;
    }
    #trackArea, #mouseChart {
        max-width: 100vw;
        width: 100%;
        height: 100px;
    }
}
</style>

<!-- Button to open modal -->
<div class="btn-header code">
    <a href="#" id="openModalBtn" class="btn btn-red">
        <i class="fas fa-play"></i> 
        Run Example
    </a>
    <a href="/docs/tutorials/mouse" class="btn btn-green">
        <i class="fas fa-code"></i> 
        Source Code
    </a>
</div>

<!-- Modal structure -->
<div id="mouseModal">
    <div class="container">
        <button id="closeModalBtn" style="position:absolute; top:1em; right:1em;">&times;</button>
        <h3>Move your mouse inside the rectangle</h3>
        <div id="trackArea"></div>
        <canvas id="mouseChart"></canvas>
    </div>
</div>

<script type="module">
import { ModelBuilder, SourceNode, DataFrame, DataObject, Absolute2DPosition, SinkNode, SMAFilterNode, ReferenceSpace, AngleUnit, Euler } from '/scripts/vendor/openhps/openhps-core.es.min.js';

let model = undefined;

class MouseSourceNode extends SourceNode {
    elementId = "";
    trackingArea = undefined;

    constructor(elementId) {
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

    onMouseMove(e) {
        const rect = this.trackingArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this._emitPosition(x, y);
    }

    onTouchMove(e) {
        if (e.touches.length > 0) {
            const rect = this.trackingArea.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this._emitPosition(x, y);
        }
    }

    _emitPosition(x, y) {
        const mouse = new DataObject("mouse");
        mouse.position = new Absolute2DPosition(x, y);
        const frame = new DataFrame(mouse);
        this.push(frame);
    }

    onPull() {
        return new Promise((resolve) => {
            resolve(undefined);
        });
    }
}

class ChartSinkNode extends SinkNode {
    elementId = "";
    chartCanvas = undefined;
    chart = undefined;

    constructor(elementId) {
        super();
        this.elementId = elementId;
        this.once('build', this._initChart.bind(this));
    }

    _initChart() {
        this.chartCanvas = document.getElementById(this.elementId);

        if (!window.Chart) {
            // Load Chart.js if not loaded
            import('https://cdn.jsdelivr.net/npm/chart.js').then(() => this._initChart());
            return;
        }
    }

    onPush(frame) {
        return new Promise((resolve, reject) => {
            // Store and retrieve historical data (supports multiple different object UIDs)
            const service = this.model.findDataService("NodeData");
            service
                .findData(this.uid, frame.source)
                .then((data) => {
                    data = data ?? [];
                    data.push({ x: frame.source.position.x, y: frame.source.position.y });
                    return service.insertData(this.uid, frame.source, data);
                })
                .then((data) => {
                    this.drawChart(data.data);
                    resolve();
                })
                .catch(reject);
        });
    }

    drawChart(data) {
        const ctx = this.chartCanvas.getContext('2d');
        if (this.chart) this.chart.destroy();
        this.chart = new window.Chart(ctx, {
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

function createModal() {
    const mouseReferenceSpace = new ReferenceSpace()
        .translation(0, 200)
        .rotation(new Euler(180, 0, 0, 'ZXY', AngleUnit.DEGREE));

    ModelBuilder.create()
        .from(new MouseSourceNode("trackArea"))
        .convertFromSpace(mouseReferenceSpace)
        .via(new SMAFilterNode((obj) => ([
                { key: "x", value: obj.position.x },
                { key: "y", value: obj.position.y }
            ]),
            (key, value, obj) => { obj.position[key] = value },
            { taps: 40 }))
        .to(new ChartSinkNode("mouseChart"))
        .build().then(m => {
            model = m;
        }).catch(ex => {
            console.error(ex);
        });
}

const openBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('mouseModal');
const closeBtn = document.getElementById('closeModalBtn');

openBtn.onclick = () => {
    modal.style.display = 'flex';
    createModal();
};
closeBtn.onclick = () => modal.style.display = 'none';
modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
</script>
