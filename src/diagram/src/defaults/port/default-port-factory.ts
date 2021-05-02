/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { AbstractModelFactory } from '../../canvas-core/core/abstract-model-factory';
import { DiagramEngine } from '../../diagram-core/diagram-engine';
import { DefaultPortModel, DefaultPortModelOptions } from './default-port-model';

@Component({
  selector: 'default-port-factory',
  template: `
    <ng-template>
    </ng-template>
  `
})
export class DefaultPortFactory extends AbstractModelFactory<DefaultPortModel, DiagramEngine> {
  constructor() {
    super('default');
  }

  generateModel(): DefaultPortModel {
    return new DefaultPortModel({
      name: 'unknown'
    } as DefaultPortModelOptions);
  }
}
