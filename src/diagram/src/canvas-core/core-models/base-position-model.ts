/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Vector2, Rectangle } from '@gradii/vector-math';
import { ModelGeometryInterface } from '../core/model-geometry-interface';
import { BaseEntityEvent, DeserializeEvent } from './base-entity';
import { BaseModel, BaseModelGenerics, BaseModelListener, BaseModelOptions } from './base-model';

export interface BasePositionModelListener extends BaseModelListener {
  positionChanged?(event: BaseEntityEvent<BasePositionModel>): void;
}

export interface BasePositionModelOptions extends BaseModelOptions {
  position?: Vector2;
}

export interface BasePositionModelGenerics extends BaseModelGenerics {
  LISTENER: BasePositionModelListener;
  OPTIONS: BasePositionModelOptions;
}

export class BasePositionModel<G extends BasePositionModelGenerics = BasePositionModelGenerics> extends BaseModel<G>
  implements ModelGeometryInterface {
  protected position: Vector2;

  constructor(options: BasePositionModelOptions) {
    super(options);
    this.position = options.position || new Vector2(0, 0);
  }

  setPosition(point: Vector2): void;
  setPosition(x: number, y: number): void;
  setPosition(x: number | Vector2, y?: number) {
    if (typeof x === 'object') {
      this.position = x;
    } else if (typeof x === 'number') {
      this.position = new Vector2(x, y);
    }
    this.fireEvent({}, 'positionChanged');
  }

  getBoundingBox(): Rectangle {
    return new Rectangle(this.position, 0, 0);
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.position = new Vector2(event.data.x, event.data.y);
  }

  serialize() {
    return {
      ...super.serialize(),
      x: this.position.x,
      y: this.position.y
    };
  }

  getPosition(): Vector2 {
    return this.position;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }
}
