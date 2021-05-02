/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { DeserializeEvent } from '../../../canvas-core/core-models/base-entity';
import {
  BaseModel,
  BaseModelGenerics,
  BaseModelOptions
} from '../../../canvas-core/core-models/base-model';
import { LinkModel } from '../link/link-model';

export interface LabelModelOptions extends BaseModelOptions {
  offsetX?: number;
  offsetY?: number;
}

export interface LabelModelGenerics extends BaseModelGenerics {
  PARENT: LinkModel;
  OPTIONS: LabelModelOptions;
}

export class LabelModel<G extends LabelModelGenerics = LabelModelGenerics> extends BaseModel<G> {

  offsetX: number = 0;
  offsetY: number = 0;

  constructor(options: G['OPTIONS']) {
    super({
      ...options,
      offsetX: options.offsetX || 0,
      offsetY: options.offsetY || 0
    });

    this.offsetX = this.options.offsetX;
    this.offsetY = this.options.offsetY;
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.offsetX = event.data.offsetX;
    this.offsetY = event.data.offsetY;

    this.options.offsetX = event.data.offsetX;
    this.options.offsetY = event.data.offsetY;
  }

  serialize() {
    return {
      ...super.serialize(),
      offsetX: this.offsetX || this.options.offsetX,
      offsetY: this.offsetX || this.options.offsetY
    };
  }
}
