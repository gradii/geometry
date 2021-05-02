/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  Inject,
  Input
} from '@angular/core';
import { ENGINE } from '../../../canvas-core/tokens';
import { DiagramEngine } from '../../diagram-engine';
import { NodeLayerModel } from './node-layer-model';


@Component({
  selector: 'node-layer-widget',
  template: `
    <node-widget *ngFor="let node of layer.getNodes()|keyvalue"
                 [attr.key]="node.value.getID()"
                 [node]="node.value"></node-widget>
  `
})
export class NodeLayerWidget {
  @Input() layer: NodeLayerModel;

  constructor(@Inject(ENGINE) public engine: DiagramEngine) {
  }

}
