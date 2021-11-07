/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Vector2,
  Polygon,
  Rectangle,
  boundingBoxFromPoints
} from '@gradii/vector-math';
import * as _ from 'lodash';
import { BaseEntityEvent, DeserializeEvent } from '../../../canvas-core/core-models/base-entity';
import {
  BaseModel,
  BaseModelGenerics,
  BaseModelListener,
  BaseModelOptions
} from '../../../canvas-core/core-models/base-model';
import { ModelGeometryInterface } from '../../../canvas-core/core/model-geometry-interface';
import { DiagramModel } from '../../models/diagram-model';
import { LabelModel } from '../label/label-model';
import { PortModel } from '../port/port-model';
import { PointModel } from './point-model';

export interface LinkModelListener extends BaseModelListener {
  sourcePortChanged(event: BaseEntityEvent<LinkModel> & { port: null | PortModel }): void;

  targetPortChanged(event: BaseEntityEvent<LinkModel> & { port: null | PortModel }): void;
}

export interface LinkModelGenerics extends BaseModelGenerics {
  LISTENER: LinkModelListener;
  PARENT: DiagramModel;
}

export class LinkModel<G extends LinkModelGenerics = LinkModelGenerics> extends BaseModel<G>
  implements ModelGeometryInterface {
  protected sourcePort: PortModel | null;
  protected targetPort: PortModel | null;

  protected labels: LabelModel[];
  protected points: PointModel[];

  protected renderedPaths: SVGPathElement[];

  constructor(options: BaseModelOptions) {
    super(options);
    this.points        = [
      new PointModel({
        link: this
      }),
      new PointModel({
        link: this
      })
    ];
    this.sourcePort    = null;
    this.targetPort    = null;
    this.renderedPaths = [];
    this.labels        = [];
  }

  getBoundingBox(): Rectangle {
    return boundingBoxFromPoints(
      _.map(this.points, (point: PointModel) => {
        return point.getPosition();
      })
    );
  }

  getSelectionEntities(): BaseModel[] {
    if (this.getTargetPort() && this.getSourcePort()) {
      return super.getSelectionEntities().concat(_.slice(this.points, 0, this.points.length));
    }
    // allow selection of the first point
    if (!this.getSourcePort()) {
      return super.getSelectionEntities().concat(_.slice(this.points, 0, this.points.length - 1));
    }
    // allow selection of the last point
    if (!this.getTargetPort()) {
      return super.getSelectionEntities().concat(_.slice(this.points, 1, this.points.length));
    }
    return super.getSelectionEntities().concat(this.points);
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.points = _.map(event.data.points || [], (point) => {
      let p = new PointModel({
        link    : this,
        position: new Vector2(point.x, point.y)
      });
      p.deserialize({
        ...event,
        data: point
      });
      return p;
    });
  }

  getRenderedPath(): SVGPathElement[] {
    return this.renderedPaths;
  }

  setRenderedPaths(paths: SVGPathElement[]) {
    this.renderedPaths = paths;
  }

  serialize() {
    return {
      ...super.serialize(),
      source    : this.sourcePort ? this.sourcePort.getParent().getID() : null,
      sourcePort: this.sourcePort ? this.sourcePort.getID() : null,
      target    : this.targetPort ? this.targetPort.getParent().getID() : null,
      targetPort: this.targetPort ? this.targetPort.getID() : null,
      points    : _.map(this.points, (point) => {
        return point.serialize();
      }),
      labels    : _.map(this.labels, (label) => {
        return label.serialize();
      })
    };
  }

  doClone(lookupTable = {}, clone: any) {
    clone.setPoints(
      _.map(this.getPoints(), (point: PointModel) => {
        return point.clone(lookupTable);
      })
    );
    if (this.sourcePort) {
      clone.setSourcePort(this.sourcePort.clone(lookupTable));
    }
    if (this.targetPort) {
      clone.setTargetPort(this.targetPort.clone(lookupTable));
    }
  }

  clearPort(port: PortModel) {
    if (this.sourcePort === port) {
      this.setSourcePort(null);
    } else if (this.targetPort === port) {
      this.setTargetPort(null);
    }
  }

  remove() {
    if (this.sourcePort) {
      this.sourcePort.removeLink(this);
    }
    if (this.targetPort) {
      this.targetPort.removeLink(this);
    }
    super.remove();
  }

  isLastPoint(point: PointModel) {
    const index = this.getPointIndex(point);
    return index === this.points.length - 1;
  }

  getPointIndex(point: PointModel) {
    return this.points.indexOf(point);
  }

  getPointModel(id: string): PointModel | null {
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].getID() === id) {
        return this.points[i];
      }
    }
    return null;
  }

  getPortForPoint(point: PointModel): PortModel {
    if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
      return this.sourcePort;
    }
    if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
      return this.targetPort;
    }
    return null;
  }

  getPointForPort(port: PortModel): PointModel {
    if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
      return this.getFirstPoint();
    }
    if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
      return this.getLastPoint();
    }
    return null;
  }

  getFirstPoint(): PointModel {
    return this.points[0];
  }

  getLastPoint(): PointModel {
    return this.points[this.points.length - 1];
  }

  setSourcePort(port: PortModel) {
    if (port !== null) {
      port.addLink(this);
    }
    if (this.sourcePort !== null) {
      this.sourcePort.removeLink(this);
    }
    this.sourcePort = port;
    this.attach();
    this.fireEvent({port}, 'sourcePortChanged');
  }

  getSourcePort(): PortModel {
    return this.sourcePort;
  }

  getTargetPort(): PortModel {
    return this.targetPort;
  }

  setTargetPort(port: PortModel) {
    if (port !== null) {
      port.addLink(this);
    }
    if (this.targetPort !== null) {
      this.targetPort.removeLink(this);
    }
    this.targetPort = port;
    this.attach();
    this.fireEvent({port}, 'targetPortChanged');
  }

  point(x: number, y: number, index: number = 1): PointModel {
    return this.addPoint(this.generatePoint(x, y), index);
  }

  addLabel(label: LabelModel) {
    label.setParent(this);
    this.labels.push(label);
  }

  getPoints(): PointModel[] {
    return this.points;
  }

  getLabels() {
    return this.labels;
  }

  setPoints(points: PointModel[]) {
    _.forEach(points, (point) => {
      point.setParent(this);
    });
    this.points = points;
    this.attach();
  }

  removePoint(pointModel: PointModel) {
    this.points.splice(this.getPointIndex(pointModel), 1);
    this.attach();
  }

  removePointsBefore(pointModel: PointModel) {
    this.points.splice(0, this.getPointIndex(pointModel));
    this.attach();
  }

  removePointsAfter(pointModel: PointModel) {
    this.points.splice(this.getPointIndex(pointModel) + 1);
    this.attach();
  }

  removeMiddlePoints() {
    if (this.points.length > 2) {
      this.points.splice(0, this.points.length - 2);
      this.attach();
    }
  }

  addPoint<P extends PointModel>(pointModel: P, index = 1): P {
    pointModel.setParent(this);
    this.points.splice(index, 0, pointModel);

    this.attach();
    return pointModel;
  }

  generatePoint(x: number = 0, y: number = 0): PointModel {
    return new PointModel({
      link    : this,
      position: new Vector2(x, y)
    });
  }

  attach() {
  }
}
