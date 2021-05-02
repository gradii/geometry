/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, Input } from '@angular/core';
import { CanvasEngine } from '../../canvas-engine';
import { ENGINE } from '../../tokens';
import { LayerModel } from './layer-model';

@Component({
  selector: 'smart-layer-widget, svg:g[smart-layer-widget]',
  template: `
    <ng-template
      [ngTemplateOutlet]="engine.getFactoryForLayer(layer).generateReactWidget({model: this.layer})"
      [ngTemplateOutletContext]="{event: {model: layer}}"
    >
    </ng-template>
    
<!--    <g x-link-layer-widget [layer]="layer"></g>-->
  `
})
export class SmartLayerWidget {

  @Input()
  layer: LayerModel;

  constructor(@Inject(ENGINE) public engine: CanvasEngine) {
  }


  // shouldComponentUpdate(): boolean {
  //   return this.layer.isRepaintEnabled();
  // }
}
