/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DeserializeEvent } from '@gradii/diagram/canvas-core';
import {
  LabelModel,
  LabelModelGenerics,
  LabelModelOptions
} from '@gradii/diagram/diagram-core';

export interface DefaultLabelModelOptions extends LabelModelOptions {
  label?: string;
}

export interface DefaultLabelModelGenerics extends LabelModelGenerics {
  OPTIONS: DefaultLabelModelOptions;
}

export class DefaultLabelModel extends LabelModel<DefaultLabelModelGenerics> {
  label: string;

  constructor(options: DefaultLabelModelOptions = {}) {
    super({
      offsetY: options.offsetY == null ? -23 : options.offsetY,
      type   : 'default',
      ...options
    });
  }

  setLabel(label: string) {
    this.label         = label;
    this.options.label = label;
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.label         = event.data.label;
    this.options.label = event.data.label;
  }

  serialize() {
    return {
      ...super.serialize(),
      label: this.label || this.options.label
    };
  }
}
