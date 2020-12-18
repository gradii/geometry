/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { LayerModel } from '../layer/layer-model';
import { FactoryBank } from '../../core/factory-bank';
import { AbstractModelFactory } from '../../core/abstract-model-factory';
import { BaseModel } from '../../core-models/base-model';

export class SelectionLayerModel extends LayerModel {
  box: ClientRect;

  constructor() {
    super({
      transformed: false,
      isSvg: false,
      type: 'selection'
    });
  }

  setBox(rect: ClientRect) {
    this.box = rect;
  }

  getChildModelFactoryBank(): FactoryBank<AbstractModelFactory<BaseModel>> {
    // is not used as it doesnt serialize
    return null;
  }
}