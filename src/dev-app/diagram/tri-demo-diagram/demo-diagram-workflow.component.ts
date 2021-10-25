/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  DiagramComponent, DiagramLinkModel, DiagramModel, DiagramNodeModel
} from '@gradii/triangle/diagram';
import { TriDragDrop, TriDragEnter } from '@gradii/triangle/dnd';


@Component({
  selector : 'demo-diagram-workflow',
  template : `
    <h3>demo diagram workflow</h3>
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
                <tri-tab-group>
                  <tri-tab label="html native dnd">
                    <div style="display: flex">
                      <div
                        *ngFor="let node of nodesLibrary"
                        class="node-drag"
                        draggable="true"
                        [attr.data-type]="node.name"
                        (dragstart)="onBlockDrag($event)"
                        [ngStyle]="{ 'background-color': node.color }"
                      >
                        {{ node.name }}
                      </div>
                    </div>
                  </tri-tab>
                  <tri-tab label="use dnd">
                    <div triDragContainer>
                      <div style="display: flex">
                        <div
                          triDrag
                          *ngFor="let node of nodesLibrary"
                          class="node-drag"
                          [attr.data-type]="node.name"
                          [ngStyle]="{ 'background-color': node.color }"
                        >
                          {{ node.name }}
                        </div>
                      </div>
                    </div>
                  </tri-tab>
                </tri-tab-group>
              </div>

              <div triDropFreeContainer
                   (triDropFreeContainerEntered)="onDragEnter($event)"
                   (triDropFreeContainerDropped)="onDropped($event)"
              >
                <div class="container" style="width: 800px; height: 400px">
                  <tri-diagram [engineModel]="model"
                               (drop)="onBlockDropped($event)"
                               (dragover)="$event.preventDefault()"
                  ></tri-diagram>
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
  styleUrls: ['demo-diagram-workflow.component.scss']
})
export class DemoDiagramWorkflowComponent implements AfterViewInit, OnInit {
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
    {color: '#AFF8D8', name: 'default1'},
    {color: '#FFB5E8', name: 'default2'},
    {color: '#85E3FF', name: 'default3'},
  ];

  constructor() {
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
    let node1 = new DiagramNodeModel({
      name : 'Node 1',
      color: 'rgb(0,192,255)'
    });
    node1.setPosition(100, 50);
    let port1 = node1.addOutPort('Out');


    let node10 = new DiagramNodeModel({
      name : 'Start',
      color: 'rgb(205,20,79)'
    });
    let port11 = node10.addOutPort('Out');
    node10.setPosition(100, 100);

    // 3-B) create another default node
    let node2 = new DiagramNodeModel('Node 2', 'rgb(192,255,0)');

    let port2 = node2.addInPort('In');
    node2.setPosition(400, 100);

    let node3  = new DiagramNodeModel('Node 2', 'rgb(192,255,0)');
    let port31 = node3.addInPort('In1 ... Long Desc');
    let port32 = node3.addInPort('In2');

    let portOut31 = node3.addOutPort('Out1 ... Long Desc');
    let portOut32 = node3.addOutPort('Out2');
    node3.setPosition(500, 100);

    // link the ports
    let link1       = port1.link<DiagramLinkModel>(port2);
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

        let nodesCount = 0;

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
        name : nodeData.name,
        color: nodeData.color
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

      const nodeType = 'default1';
      const color    = '#d085ff';
      const node     = this.createNode(nodeType);

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
    console.log(evt);
  }

  ngAfterViewInit() {
  }


}
