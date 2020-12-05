/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */
import { NgModule } from '@angular/core';
import { DiagramEngineComponent } from './diagram-engine.component';
import { CanvasEngineModule, ENGINE_OPTIONS } from '@gradii/diagram/canvas-core';
import { DefaultsModule } from '@gradii/diagram/defaults';
import { DiagramCoreModule } from '@gradii/diagram/diagram-core';

@NgModule({
  imports: [
    CanvasEngineModule,
    CanvasEngineModule,
    DefaultsModule,
    DiagramCoreModule,
  ],
  declarations: [
    DiagramEngineComponent
  ],
  exports: [
    DiagramEngineComponent
  ],
  providers: [
    {
      provide: ENGINE_OPTIONS, useValue: {},
    }
  ]
})
export class DiagramEngineModule {

}
