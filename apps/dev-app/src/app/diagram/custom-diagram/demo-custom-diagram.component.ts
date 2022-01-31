/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import {
  DiagramComponent, DiagramLinkModel, DiagramModel, DiagramNodeModel
} from '@gradii/triangle/diagram';
import { TriDragDrop, TriDragEnter } from '@gradii/triangle/dnd';
import { take, tap } from 'rxjs/operators';


@Component({
  selector : 'demo-custom-diagram',
  template : `
    <h3>demo custom diagram</h3>
    <div>
      <tri-splitter class="splitter-border"
                    [orientation]="orientation"
                    [splitBarSize]="splitBarSize">
        <tri-splitter-pane
          [size]="size"
          [minSize]="minSize"
          [maxSize]="maxSize"
          [collapsible]="true"
          (sizeChange)="sizeChange($event)"
          (collapsedChange)="collapsedChange($event)"
        >
          <div class="pane-content">
            <div triDropContainerGroup>
              <div>
                <div>
                  <button triButton (click)="onClick()">serialize</button>
                  <button triButton (click)="onDeserialize()">deserialize</button>

                </div>
                <div triDragContainer>
                  <div style="display: flex">
                    <div
                      triDrag
                      [triDragData]="node"
                      *ngFor="let node of nodesLibrary"
                      class="node-drag"
                      [ngStyle]="{ 'background-color': node.color }"
                    >
                      {{ node.name }}
                    </div>
                  </div>
                </div>
              </div>

              <div triDropFreeContainer
                   (triDropFreeContainerEntered)="onDragEnter($event)"
                   (triDropFreeContainerDropped)="onDropped($event)"
              >
                <div class="container" style="width: 800px; height: 400px">
                  <tri-diagram [engineModel]="model"
                               (selection)="onSelectionChanged($event)"
                               (drop)="onBlockDropped($event)"
                               (dragover)="$event.preventDefault()"
                  >
                  </tri-diagram>
                </div>
              </div>

            </div>
          </div>
        </tri-splitter-pane>
        <tri-splitter-pane minSize="15%">
          <div class="pane-content">
            <h2>Right</h2>
            <div>Content</div>
          </div>
        </tri-splitter-pane>
      </tri-splitter>

    </div>
  `,
  styleUrls: ['demo-custom-diagram.component.scss']
})
export class DemoCustomDiagramComponent implements AfterViewInit, OnInit {
  @ViewChild(DiagramComponent, {static: true})
  diagram?: DiagramComponent;


  model = new DiagramModel();

  // splitter input
  orientation     = 'horizontal';
  splitBarSize    = '2px';
  disabledBarSize = '1px';

  // splitter pane input
  size    = '30%';
  minSize = '20%';
  maxSize = '60%';

  nodesLibrary = [
    {color: '#AFF8D8', name: 'custom-default1', namespace: 'audit'},
    {color: '#FFB5E8', name: 'custom-default2', namespace: 'audit-person'},
    {color: '#85E3FF', name: 'custom-default3', namespace: 'audit-department'},
  ];

  constructor(private ngZone: NgZone) {
  }

  sizeChange(size) {
    console.log(size);
  }

  collapsedChange(event) {
    console.log(event);
  }

  ngOnInit() {

    // 2) setup the diagram model
    // let model = new DiagramModel();
    const model = this.model;

    // 3-A) create a default node
    const node1 = new DiagramNodeModel({
      displayName: 'Node 1',
      color      : 'rgb(0,192,255)'
    });
    node1.setPosition(100, 50);
    const port1 = node1.addOutPort('Out01');


    const node10 = new DiagramNodeModel({
      displayName: 'Start',
      color      : 'rgb(205,20,79)'
    });
    const port11 = node10.addOutPort('Out02');
    node10.setPosition(100, 100);

    // 3-B) create another default node
    const node2 = new DiagramNodeModel('Node 2', 'Node 2', 'rgb(192,255,0)');

    const port2 = node2.addInPort('In01');
    node2.setPosition(400, 100);

    const node3  = new DiagramNodeModel('Node 2', 'Node 2', 'rgb(192,255,0)');
    const port31 = node3.addInPort('In1', 'In1 ... Long Desc');
    const port32 = node3.addInPort('In2');

    const portOut31 = node3.addOutPort('Out1', 'Out1 ... Long Desc');
    const portOut32 = node3.addOutPort('Out2');
    node3.setPosition(500, 100);

    // link the ports
    const link1     = port1.link<DiagramLinkModel>(port2);
    link1.labelName = 'Test';
    link1.addLabel('Hello World!');

    // 4) add the models to the root graph
    model.addAll(node1, node2, link1, node3, node10);


  }

  /**
   * On drag start, assign the desired properties to the dataTransfer
   */
  onBlockDrag(e: DragEvent) {
    const type = (e.target as HTMLElement).getAttribute('data-type');
    if (e.dataTransfer && type) {
      e.dataTransfer.setData('type', type);
      e.dataTransfer.setData('color', this.nodesLibrary.find(it => it.name === type).color);
    }
  }

  /**
   * on block dropped, create new intent with the empty data of the selected block type
   */
  onBlockDropped(e: DragEvent): void | undefined {
    if (e.dataTransfer) {
      const nodeType      = e.dataTransfer.getData('type');
      const color         = e.dataTransfer.getData('color');
      const node          = this.createNode(nodeType);
      const canvasManager = this.diagram?.engine;
      if (canvasManager) {
        const droppedPoint = canvasManager.getRelativeMousePoint(e);

        const nodesCount = 0;

        // const nodePort1 = new DiagramNodeModel('Node ' + (++nodesCount), 'rgb(192,255,0)')
        //   .addInPort('In');
        // const nodePort2 = new DiagramNodeModel('Node ' + (++nodesCount), 'rgb(0,192,255)')
        //   .addOutPort('Out');
        //
        // node.addPort(nodePort1);
        // node.addPort(nodePort2);

        node.addInPort('In');
        node.addOutPort('Out');
        node.color = color;

        const coords = {
          x: droppedPoint.x,
          y: droppedPoint.y,
        };

        if (node) {
          node.setPosition(coords.x, coords.y);
          this.model.addNode(node);
          canvasManager.repaintCanvas();
        }
      }
    }
  }


  createNode(type: string) {
    const nodeData = this.nodesLibrary.find((nodeLib) => nodeLib.name === type);
    if (nodeData) {
      const node = new DiagramNodeModel({
        name       : nodeData.name,
        displayName: nodeData.name,
        namespace  : nodeData.namespace,
        color      : nodeData.color
      });
      // node.setExtras(nodeData);

      return node;
    }

    return null;
  }


  onDragEnter(evt: TriDragEnter) {
    console.log(evt);
  }

  onDropped(evt: TriDragDrop<any>) {
    const canvasManager = this.diagram?.engine;
    if (canvasManager) {
      const pointer      = {
        clientX: evt.elementPosition.x,
        clientY: evt.elementPosition.y
      };
      const droppedPoint = canvasManager.getRelativeMousePoint(pointer);

      const nodeType = evt.item.data.name;
      const color    = evt.item.data.color;
      const node     = this.createNode(nodeType);

      node.addInPort('in', '');
      node.addOutPort('out', '');
      node.color = color;

      const coords = {
        x: droppedPoint.x,
        y: droppedPoint.y,
      };

      if (node) {
        node.setPosition(coords.x, coords.y);
        this.model.addNode(node);
        canvasManager.repaintCanvas();
      }
    }
    console.log(evt);
  }

  serialized: any;

  onClick() {
    this.serialized = this.model.serialize();
    console.log(this.serialized);
  }

  onDeserialize() {
    const str = JSON.stringify(this.model.serialize());

    // !------------- DESERIALIZING ----------------

    const model2 = new DiagramModel();
    model2.deserializeModel(JSON.parse(str), this.diagram.engine);

    this.ngZone.onStable.pipe(
      take(1),
      tap(() => {
        console.log(model2.serialize());
        // model2.offsetX += -20;
        // model2.zoom *= 0.9;

        this.model = model2;
      })
    ).subscribe();
  }

  onSelectionChanged(event: any) {
    console.log(event);
  }

  ngAfterViewInit() {
  }


}
