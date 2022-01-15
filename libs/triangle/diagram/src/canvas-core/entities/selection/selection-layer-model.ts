/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

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

// import { BaseModel } from '../../core-models/base-model';
// import { AbstractModelFactory } from '../../core/abstract-model-factory';
// import { FactoryBank } from '../../core/factory-bank';
import { LayerModel } from '../layer/layer-model';
import {ParticleClientRect} from '../../states/selection-box-state';

export class SelectionLayerModel extends LayerModel {

  box: ParticleClientRect;

  constructor() {
    super({
      transformed: false,
      isSvg: false,
      type: 'selection'
    });
  }

  setBox(rect: ParticleClientRect) {
    this.box = rect;
  }

  // getChildModelFactoryBank(): FactoryBank<AbstractModelFactory<BaseModel>> {
  //   // is not used as it doesnt serialize
  //   return null;
  // }
}
