/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeLayerFactory } from './entities/node-layer/node-layer-factory';
import { NodeLayerWidget } from './entities/node-layer/node-layer-widget';
import { LinkLayerFactory } from './entities/link-layer/link-layer-factory';
import { CanvasEngineModule } from '@gradii/diagram/canvas-core';
import { PortWidget } from './entities/port/port-widget';
import { LinkLayerWidget } from './entities/link-layer/link-layer-widget';
import { LinkWidget } from './entities/link/link-widget';
import { LabelWidget } from './entities/label/label-widget';
import { NodeWidget } from './entities/node/node-widget';


@NgModule({
  imports: [
    CommonModule,
    CanvasEngineModule,
  ],
  declarations: [
    NodeWidget,

    NodeLayerFactory,
    NodeLayerWidget,

    LabelWidget,

    LinkWidget,

    LinkLayerFactory,
    LinkLayerWidget,

    PortWidget
  ],
  exports: [
    NodeWidget,

    NodeLayerFactory,
    NodeLayerWidget,

    LabelWidget,

    LinkWidget,

    LinkLayerFactory,
    LinkLayerWidget,

    PortWidget
  ]
})
export class DiagramCoreModule {

}
