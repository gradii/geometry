/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DefaultPortModel, DefaultPortModelOptions } from './default-port-model';
import { AbstractModelFactory } from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '@gradii/diagram/diagram-core';
import { Component } from '@angular/core';

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
