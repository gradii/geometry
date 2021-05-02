/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input } from '@angular/core';
import { LayerModel } from './layer-model';

@Component({
  selector: 'transform-layer-widget',
  template: `
    <ng-template [ngIf]="layer.isSvg" [ngIfElse]="notSvg">
      <svg class="layer" [ngStyle]="getTransformStyle()">
        <g link-layer-widget [layer]="layer"></g>
      </svg>
    </ng-template>
    <ng-template #notSvg>
      <div class="layer" [ngStyle]="getTransformStyle()">
        <node-layer-widget [layer]="layer" [attr.key]="layer.getID()"></node-layer-widget>
      </div>
    </ng-template>
  `,
  styles: [
    `:host .layer {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        pointer-events: none;
        transform-origin: 0 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
    `
  ]
})
export class TransformLayerWidget {

  @Input()
  layer: LayerModel;

  getTransform() {
    const model = this.layer.getParent();
    return `
			translate(
				${model.getOffsetX()}px,
				${model.getOffsetY()}px)
			scale(
				${model.getZoomLevel() / 100.0}
			)
  	`;
  }

  getTransformStyle() {
    if (this.layer.transformed) {
      return {
        transform: this.getTransform()
      };
    }
    return {};
  }
}
