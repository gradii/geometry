/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { SelectionBoxLayerFactory } from './selection/selection-box-layer-factory';
import { SelectionBoxWidget } from './selection/selection-box-widget';
import { CommonModule } from '@angular/common';
import { TransformLayerWidget } from './layer/transform-layer-widget';
import { CanvasWidget } from './canvas/canvas-widget';
import { SmartLayerWidget } from './layer/smart-layer-widget';

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
