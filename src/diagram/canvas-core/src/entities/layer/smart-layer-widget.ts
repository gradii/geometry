/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { LayerModel } from './layer-model';
import { CanvasEngine } from '../../canvas-engine';
import { Component, Inject, Input } from '@angular/core';
import { ENGINE } from '../../tokens';

@Component({
  selector: 'smart-layer-widget, g[smart-layer-widget]',
  template: `
    <ng-template
      [ngTemplateOutlet]="engine.getFactoryForLayer(layer).generateReactWidget({model: this.layer})"
      [ngTemplateOutletContext]="{event: {model: layer}}"
    >
    </ng-template>
  `
})
export class SmartLayerWidget {

  constructor(@Inject(ENGINE) public engine: CanvasEngine) {
  }

  @Input()
  layer: LayerModel;


  // shouldComponentUpdate(): boolean {
  //   return this.layer.isRepaintEnabled();
  // }
}
