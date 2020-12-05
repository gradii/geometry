/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { LabelModel, LabelModelGenerics, LabelModelOptions } from '@gradii/diagram/diagram-core';
import { DeserializeEvent } from '@gradii/diagram/canvas-core';

export interface DefaultLabelModelOptions extends LabelModelOptions {
  label?: string;
}

export interface DefaultLabelModelGenerics extends LabelModelGenerics {
  OPTIONS: DefaultLabelModelOptions;
}

export class DefaultLabelModel extends LabelModel<DefaultLabelModelGenerics> {
  constructor(options: DefaultLabelModelOptions = {}) {
    super({
      offsetY: options.offsetY == null ? -23 : options.offsetY,
      type: 'default',
      ...options
    });
  }

  setLabel(label: string) {
    this.options.label = label;
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.options.label = event.data.label;
  }

  serialize() {
    return {
      ...super.serialize(),
      label: this.options.label
    };
  }
}
