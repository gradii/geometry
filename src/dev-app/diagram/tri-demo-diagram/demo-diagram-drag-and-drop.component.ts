import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  DefaultNodeModel, DiagramComponent, DiagramModel, NodeModel
} from '@gradii/triangle/diagram';

@Component({
  selector: 'app-root',
  template: `
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
  styleUrls: [
    'demo-diagram.component.css',
    'demo-diagram-drag-and-drop.component.css',
  ],
})
export class DemoDiagramDragAndDropComponent implements AfterViewInit {
  diagramModel: DiagramModel;
  nodesDefaultDimensions = { height: 200, width: 200 };
  nodesLibrary = [
    { color: '#AFF8D8', name: 'default' },
    { color: '#FFB5E8', name: 'default' },
    { color: '#85E3FF', name: 'default' },
  ];
  @ViewChild(DiagramComponent, { static: true })
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
      const node = new DefaultNodeModel({
        name: nodeData.name,
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
    }
  }

  /**
   * on block dropped, create new intent with the empty data of the selected block type
   */
  onBlockDropped(e: DragEvent): void | undefined {
    if (e.dataTransfer) {
      const nodeType = e.dataTransfer.getData('type');
      const node = this.createNode(nodeType);
      // const canvasManager = this.diagram?.diagramEngine.getCanvasManager();
      // if (canvasManager) {
      //   const droppedPoint = canvasManager.getZoomAwareRelativePoint(e);
      //
      //   const coords = {
      //     x: droppedPoint.x - this.nodesDefaultDimensions.width / 2,
      //     y: droppedPoint.y - this.nodesDefaultDimensions.height / 2,
      //   };
      //
      //   if (node) {
      //     node.setCoords(coords);
          this.diagramModel.addNode(node);
        // }
      // }
    }
  }
}
