/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CanvasEngineModule } from '@gradii/diagram/canvas-core';
import { LabelWidget } from './entities/label/label-widget';
import { LinkLayerFactory } from './entities/link-layer/link-layer-factory';
import { LinkLayerWidget } from './entities/link-layer/link-layer-widget';
import { LinkWidget } from './entities/link/link-widget';
import { NodeLayerFactory } from './entities/node-layer/node-layer-factory';
import { NodeLayerWidget } from './entities/node-layer/node-layer-widget';
import { NodeWidget } from './entities/node/node-widget';
import { PortWidget } from './entities/port/port-widget';


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
