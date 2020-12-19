/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */
import { NgModule } from '@angular/core';
import { CanvasEngineModule, ENGINE_OPTIONS } from '@gradii/diagram/canvas-core';
import { DefaultsModule } from '@gradii/diagram/defaults';
import { DefaultDiagramState, DiagramCoreModule } from '@gradii/diagram/diagram-core';
import { DiagramEngineComponent } from './diagram-engine.component';
import { DIAGRAM_STATES } from './tokens';

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
      provide: DIAGRAM_STATES, useClass: DefaultDiagramState, multi: true,
    },
    {
      provide: ENGINE_OPTIONS, useValue: {},
    }
  ]
})
export class DiagramEngineModule {

}
