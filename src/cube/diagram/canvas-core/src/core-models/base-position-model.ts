/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Point, Rectangle } from '@gradii/diagram/geometry';
import { ModelGeometryInterface } from '../core/model-geometry-interface';
import { BaseEntityEvent, DeserializeEvent } from './base-entity';
import { BaseModel, BaseModelGenerics, BaseModelListener, BaseModelOptions } from './base-model';

export interface BasePositionModelListener extends BaseModelListener {
  positionChanged?(event: BaseEntityEvent<BasePositionModel>): void;
}

export interface BasePositionModelOptions extends BaseModelOptions {
  position?: Point;
}

export interface BasePositionModelGenerics extends BaseModelGenerics {
  LISTENER: BasePositionModelListener;
  OPTIONS: BasePositionModelOptions;
}

export class BasePositionModel<G extends BasePositionModelGenerics = BasePositionModelGenerics> extends BaseModel<G>
  implements ModelGeometryInterface {
  protected position: Point;

  constructor(options: G['OPTIONS']) {
    super(options);
    this.position = options.position || new Point(0, 0);
  }

  setPosition(point: Point): void;
  setPosition(x: number, y: number): void;
  setPosition(x: number | Point, y?: number) {
    if (typeof x === 'object') {
      this.position = x;
    } else if (typeof x === 'number') {
      this.position = new Point(x, y);
    }
    this.fireEvent({}, 'positionChanged');
  }

  getBoundingBox(): Rectangle {
    return new Rectangle(this.position, 0, 0);
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.position = new Point(event.data.x, event.data.y);
  }

  serialize() {
    return {
      ...super.serialize(),
      x: this.position.x,
      y: this.position.y
    };
  }

  getPosition(): Point {
    return this.position;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }
}
