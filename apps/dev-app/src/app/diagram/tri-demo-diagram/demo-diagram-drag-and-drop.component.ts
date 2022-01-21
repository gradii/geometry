/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DiagramComponent, DiagramModel, DiagramNodeModel } from '@gradii/triangle/diagram';

@Component({
  selector : 'app-root',
  template : `
    <div class="action-bar">
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
      <div></div>
    </div>
    <tri-diagram
      class="demo-diagram"
      [engineModel]="diagramModel"
      (drop)="onBlockDropped($event)"
      (dragover)="$event.preventDefault()"
    ></tri-diagram>
  `,
  styles   : [
    `
      :host {
        height: 800px;
        width: 800px;
        display: block;
      }
    `
  ],
  styleUrls: [
    'demo-diagram.component.scss',
    'demo-diagram-drag-and-drop.component.scss',
  ],
})
export class DemoDiagramDragAndDropComponent implements AfterViewInit {
  diagramModel: DiagramModel;
  nodesDefaultDimensions = {height: 200, width: 200};
  nodesLibrary           = [
    {color: '#AFF8D8', name: 'default1'},
    {color: '#FFB5E8', name: 'default2'},
    {color: '#85E3FF', name: 'default3'},
  ];
  @ViewChild(DiagramComponent, {static: true})
  diagram?: DiagramComponent;

  constructor() {
    this.diagramModel = new DiagramModel();
  }

  ngAfterViewInit() {
    // this.diagram?.zoomToFit();
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
          this.diagramModel.addNode(node);
          canvasManager.repaintCanvas();
        }
      }
    }
  }
}
