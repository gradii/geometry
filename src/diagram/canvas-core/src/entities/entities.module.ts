/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CanvasWidget } from './canvas/canvas-widget';
import { SmartLayerWidget } from './layer/smart-layer-widget';
import { TransformLayerWidget } from './layer/transform-layer-widget';
import { SelectionBoxLayerFactory } from './selection/selection-box-layer-factory';
import { SelectionBoxWidget } from './selection/selection-box-widget';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TransformLayerWidget,
    SelectionBoxLayerFactory,
    SelectionBoxWidget,

    CanvasWidget,
    SmartLayerWidget
  ],
  exports: [
    TransformLayerWidget,
    SelectionBoxLayerFactory,
    SelectionBoxWidget,

    CanvasWidget,
    SmartLayerWidget
  ]
})
export class EntitiesModule {

}
