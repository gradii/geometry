/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, ContentChild, Inject, Input, Optional } from '@angular/core';
import { State } from './canvas-core/core-state/state';
import { ENGINE, ENGINE_OPTIONS } from './canvas-core/tokens';
import { DiagramEngine } from './diagram-core/diagram-engine';
import { DIAGRAM_STATES } from './tokens';


@Component({
  selector : 'tri-diagram',
  providers: [
    {
      provide   : ENGINE,
      useFactory: (options = {}) => new DiagramEngine(options),
      deps      : [
        ENGINE_OPTIONS
      ]
    },
  ],
  template : `
    <div defs>
      <!--      <node-layer-factory></node-layer-factory>-->
      <!--      <link-layer-factory></link-layer-factory>-->
      <!--      <selection-box-layer-factory></selection-box-layer-factory>-->

      <!--      <default-label-factory></default-label-factory>-->
      <!--      <default-node-factory></default-node-factory>-->
      <!--      <default-link-factory></default-link-factory>-->
      <!--      <default-port-factory></default-port-factory>-->
    </div>

    <canvas-widget></canvas-widget>
  `,
  styles   : [
    `:host {
      position : relative;
      cursor   : move;
      overflow : hidden;
    }

    :host {
      display          : flex;
      height           : 100%;
      width            : 100%;
      background-color : #fafafa;
      background-image : linear-gradient(
        0deg,
        transparent 24%,
        rgba(128, 128, 128, 0.15) 25%,
        rgba(128, 128, 128, 0.15) 26%,
        transparent 27%,
        transparent 74%,
        rgba(128, 128, 128, 0.15) 75%,
        rgba(128, 128, 128, 0.15) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        rgba(128, 128, 128, 0.15) 25%,
        rgba(128, 128, 128, 0.15) 26%,
        transparent 27%,
        transparent 74%,
        rgba(128, 128, 128, 0.15) 75%,
        rgba(128, 128, 128, 0.15) 76%,
        transparent 77%,
        transparent
      );
      background-size  : 30px 30px;
    }

    `
  ]
})
export class DiagramComponent {
  // @ContentChild('node-layer')
  // nodeLayer
  // @ContentChild('link-layer')
  // linkLayer
  // @ContentChild('selection-box')
  // selectionBox

  constructor(
    @Inject(ENGINE) public engine: DiagramEngine,
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
