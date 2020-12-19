/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, Input, Optional } from '@angular/core';
import { ENGINE, ENGINE_OPTIONS, State } from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '@gradii/diagram/diagram-core';
import { DIAGRAM_STATES } from './tokens';


@Component({
  selector: 'diagram-engine',
  providers: [
    {
      provide: ENGINE,
      useFactory: (options = {}) => new DiagramEngine(options),
      deps: [
        ENGINE_OPTIONS
      ]
    },
  ],
  template: `
    <div defs>
      <node-layer-factory></node-layer-factory>
      <link-layer-factory></link-layer-factory>
      <selection-box-layer-factory></selection-box-layer-factory>

      <default-label-factory></default-label-factory>
      <default-node-factory></default-node-factory>
      <default-link-factory></default-link-factory>
      <default-port-factory></default-port-factory>
    </div>

    <canvas-widget></canvas-widget>
  `,
  styles: [
      `:host {
      position : relative;
      cursor   : move;
      overflow : hidden;
    }
    `
  ]
})
export class DiagramEngineComponent {
  constructor(
    @Inject(ENGINE) private engine: DiagramEngine,
    @Optional() @Inject(DIAGRAM_STATES) private states: State[] = []
  ) {
    states.forEach(state => {
      engine.getStateMachine().pushState(state);
    });
  }


  @Input()
  set engineModel(value: any) {
    this.engine.setModel(value);
  }
}
