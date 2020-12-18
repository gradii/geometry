/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import {
  AbstractModelFactory,
  AbstractReactFactory,
  BaseModel,
  CanvasEngine,
  CanvasEngineListener, CanvasEngineOptions,
  FactoryBank,
  Toolkit
} from '@gradii/diagram/canvas-core';
import { Point, Polygon, Rectangle } from '@gradii/diagram/geometry';
import { LabelModel } from './entities/label/label-model';
import { LinkModel } from './entities/link/link-model';
import { NodeModel } from './entities/node/node-model';
import { PortModel } from './entities/port/port-model';
import { DiagramModel } from './models/diagram-model';



export class DiagramEngine extends CanvasEngine<CanvasEngineListener> {
  maxNumberPointsPerLink: number;
  protected model: DiagramModel;
  protected nodeFactories: FactoryBank<AbstractReactFactory<NodeModel, DiagramEngine>>;
  protected linkFactories: FactoryBank<AbstractReactFactory<LinkModel, DiagramEngine>>;
  protected portFactories: FactoryBank<AbstractModelFactory<PortModel, DiagramEngine>>;
  protected labelFactories: FactoryBank<AbstractReactFactory<LabelModel, DiagramEngine>>;


  constructor(options: CanvasEngineOptions = {}) {
    super(options);
    this.maxNumberPointsPerLink = 1000;

    // create banks for the different factory types
    this.nodeFactories = new FactoryBank();
    this.linkFactories = new FactoryBank();
    this.portFactories = new FactoryBank();
    this.labelFactories = new FactoryBank();

    const setup = (factory: FactoryBank) => {
      factory.registerListener({
        factoryAdded  : (event) => {
          event.factory.setDiagramEngine(this);
        },
        factoryRemoved: (event) => {
          event.factory.setDiagramEngine(null);
        }
      });
    };

    setup(this.nodeFactories);
    setup(this.linkFactories);
    setup(this.portFactories);
    setup(this.labelFactories);
  }

  /**
   * Gets a model and element under the mouse cursor
   */
  getMouseElement(event: MouseEvent): BaseModel {
    let target = event.target as Element;
    let diagramModel = this.model;

    // is it a port
    let element = Toolkit.closest(target, '.port[data-name]');
    if (element) {
      let nodeElement = Toolkit.closest(target, '.node[data-nodeid]') as HTMLElement;
      return diagramModel.getNode(nodeElement.getAttribute('data-nodeid')).getPort(element.getAttribute('data-name'));
    }

    // look for a point
    element = Toolkit.closest(target, '.point[data-id]');
    if (element) {
      return diagramModel.getLink(element.getAttribute('data-linkid'))
        .getPointModel(element.getAttribute('data-id'));
    }

    // look for a link
    element = Toolkit.closest(target, '[data-linkid]');
    if (element) {
      return diagramModel.getLink(element.getAttribute('data-linkid'));
    }

    // look for a node
    element = Toolkit.closest(target, '.node[data-nodeid]');
    if (element) {
      return diagramModel.getNode(element.getAttribute('data-nodeid'));
    }

    return null;
  }

  // !-------------- FACTORIES ------------

  getNodeFactories() {
    return this.nodeFactories;
  }

  getLinkFactories() {
    return this.linkFactories;
  }

  getLabelFactories() {
    return this.labelFactories;
  }

  getPortFactories() {
    return this.portFactories;
  }

  getFactoryForNode<F extends AbstractReactFactory<NodeModel, DiagramEngine>>(node: NodeModel | string) {
    if (typeof node === 'string') {
      return this.nodeFactories.getFactory(node);
    }
    return this.nodeFactories.getFactory(node.getType());
  }

  getFactoryForLink<F extends AbstractReactFactory<LinkModel, DiagramEngine>>(link: LinkModel | string) {
    if (typeof link === 'string') {
      return this.linkFactories.getFactory<F>(link);
    }
    return this.linkFactories.getFactory<F>(link.getType());
  }

  getFactoryForLabel<F extends AbstractReactFactory<LabelModel, DiagramEngine>>(label: LabelModel) {
    if (typeof label === 'string') {
      return this.labelFactories.getFactory(label);
    }
    return this.labelFactories.getFactory(label.getType());
  }

  getFactoryForPort<F extends AbstractModelFactory<PortModel, DiagramEngine>>(port: PortModel) {
    if (typeof port === 'string') {
      return this.portFactories.getFactory<F>(port);
    }
    return this.portFactories.getFactory<F>(port.getType());
  }

  generateWidgetForLink(link: LinkModel) {
    return this.getFactoryForLink(link).generateReactWidget({model: link});
  }

  generateWidgetForNode(node: NodeModel) {
    return this.getFactoryForNode(node).generateReactWidget({model: node});
  }

  getNodeElement(node: NodeModel): Element {
    const selector = this.canvas.querySelector(`.node[data-nodeid="${node.getID()}"]`);
    if (selector === null) {
      throw new Error('Cannot find Node element with nodeID: [' + node.getID() + ']');
    }
    return selector;
  }

  getNodePortElement(port: PortModel): any {
    let selector = this.canvas.querySelector(
      `.port[data-name="${port.getName()}"][data-nodeid="${port.getParent().getID()}"]`
    );
    if (selector === null) {
      throw new Error(
        'Cannot find Node Port element with nodeID: [' +
        port.getParent().getID() +
        '] and name: [' +
        port.getName() +
        ']'
      );
    }
    return selector;
  }

  getPortCenter(port: PortModel): Point {
    return this.getPortCoords(port).getOrigin();
  }

  /**
   * Calculate rectangular coordinates of the port passed in.
   */
  getPortCoords(port: PortModel, element?: HTMLDivElement): Rectangle {
    if (!this.canvas) {
      throw new Error('Canvas needs to be set first');
    }
    if (!element) {
      element = this.getNodePortElement(port);
    }
    const sourceRect = element.getBoundingClientRect();
    const point = this.getRelativeMousePoint({
      clientX: sourceRect.left,
      clientY: sourceRect.top
    });
    const zoom = this.model.getZoomLevel() / 100.0;
    return new Rectangle(point.x, point.y, sourceRect.width / zoom, sourceRect.height / zoom);
  }

  /**
   * Determine the width and height of the node passed in.
   * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
   */
  getNodeDimensions(node: NodeModel): { width: number; height: number } {
    if (!this.canvas) {
      return {
        width: 0,
        height: 0
      };
    }

    const nodeElement = this.getNodeElement(node);
    const nodeRect = nodeElement.getBoundingClientRect();

    return {
      width: nodeRect.width,
      height: nodeRect.height
    };
  }

  /**
   * Get nodes bounding box coordinates with or without margin
   * @returns rectangle points in node layer coordinates
   */
  getBoundingNodesRect(nodes: NodeModel[], margin?: number): Rectangle {
    if (nodes) {
      if (nodes.length === 0) {
        return new Rectangle(0, 0, 0, 0);
      }

      let boundingBox = Polygon.boundingBoxFromPolygons(nodes.map((node) => node.getBoundingBox()));
      if (margin) {
        return new Rectangle(
          boundingBox.getTopLeft().x - margin,
          boundingBox.getTopLeft().y - margin,
          boundingBox.getWidth() + 2 * margin,
          boundingBox.getHeight() + 2 * margin
        );
      }
      return boundingBox;
    }
  }

  zoomToFitNodes(margin?: number) {
    let nodesRect; // nodes bounding rectangle
    let selectedNodes = this.model
      .getSelectedEntities()
      .filter((entity) => entity instanceof NodeModel)
      .map((node) => node) as NodeModel[];

    // no node selected
    if (selectedNodes.length == 0) {
      let allNodes = this.model
        .getSelectionEntities()
        .filter((entity) => entity instanceof NodeModel)
        .map((node) => node) as NodeModel[];

      // get nodes bounding box with margin
      nodesRect = this.getBoundingNodesRect(allNodes, margin);
    } else {
      // get nodes bounding box with margin
      nodesRect = this.getBoundingNodesRect(selectedNodes, margin);
    }

    if (nodesRect) {
      // there is something we should zoom on
      let canvasRect = this.canvas.getBoundingClientRect();
      let canvasTopLeftPoint = {
        x: canvasRect.left,
        y: canvasRect.top
      };
      let nodeLayerTopLeftPoint = {
        x: canvasTopLeftPoint.x + this.getModel().getOffsetX(),
        y: canvasTopLeftPoint.y + this.getModel().getOffsetY()
      };

      const xFactor = this.canvas.clientWidth / nodesRect.getWidth();
      const yFactor = this.canvas.clientHeight / nodesRect.getHeight();
      const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

      this.model.setZoomLevel(zoomFactor * 100);

      let nodesRectTopLeftPoint = {
        x: nodeLayerTopLeftPoint.x + nodesRect.getTopLeft().x * zoomFactor,
        y: nodeLayerTopLeftPoint.y + nodesRect.getTopLeft().y * zoomFactor
      };

      this.model.setOffset(
        this.model.getOffsetX() + canvasTopLeftPoint.x - nodesRectTopLeftPoint.x,
        this.model.getOffsetY() + canvasTopLeftPoint.y - nodesRectTopLeftPoint.y
      );
      this.repaintCanvas();
    }
  }

  getMaxNumberPointsPerLink(): number {
    return this.maxNumberPointsPerLink;
  }

  setMaxNumberPointsPerLink(max: number) {
    this.maxNumberPointsPerLink = max;
  }
}