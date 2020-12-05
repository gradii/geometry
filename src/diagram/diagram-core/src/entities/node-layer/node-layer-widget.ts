/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NodeLayerModel } from './node-layer-model';
import { DiagramEngine } from '../../diagram-engine';
import { Component, Inject, Input } from '@angular/core';
import { ENGINE } from '@gradii/diagram/canvas-core';


@Component({
  selector: 'node-layer-widget',
  template: `
    <ng-container *ngFor="let node of layer.getNodes()|keyvalue">
      <node-widget [attr.key]="node.value.getID()" [node]="node.value"></node-widget>
    </ng-container>
  `
})
export class NodeLayerWidget {
  @Input() layer: NodeLayerModel;

  constructor(@Inject(ENGINE) public engine: DiagramEngine) {
  }


}
