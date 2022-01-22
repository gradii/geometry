/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit, Component, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Optional, Output
} from '@angular/core';
import { merge, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { State } from './canvas-core/core-state/state';
import { ListenerHandle } from './canvas-core/core/base-observer';
import { ENGINE, ENGINE_OPTIONS } from './canvas-core/tokens';
import { DiagramEngine } from './diagram-core/diagram-engine';
import { DiagramNodeModel } from './models/diagram-node-model';
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
export class DiagramComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ContentChild('node-layer')
  // nodeLayer
  // @ContentChild('link-layer')
  // linkLayer
  // @ContentChild('selection-box')
  // selectionBox

  @Output()
  nodesUpdated: EventEmitter<any> = new EventEmitter();

  @Output()
  linksUpdated: EventEmitter<any> = new EventEmitter();

  @Output()
  portsUpdated: EventEmitter<any> = new EventEmitter();

  @Output()
  positionChanged: EventEmitter<any> = new EventEmitter();

  @Output()
  selection: EventEmitter<any> = new EventEmitter();

  @Output()
  stateChange: EventEmitter<any> = new EventEmitter();

  private destroy$ = new Subject();
  private registerHandle: ListenerHandle;

  constructor(
    @Inject(ENGINE) public engine: DiagramEngine,
    @Optional() @Inject(DIAGRAM_STATES) private states: State[] = [],
    private zone: NgZone
  ) {
    states.forEach(state => {
      engine.getStateMachine().pushState(state);
    });
  }

  bindEngine() {
    this.registerHandle = this.engine.registerListener({
        nodesUpdated   : (value) => {
          this.nodesUpdated.emit(value);
        },
        linksUpdated   : (value) => {
          this.linksUpdated.emit(value);
        },
        portsUpdated   : (value) => {
          this.portsUpdated.emit(value);
        },
        positionChanged: (value) => {
          this.positionChanged.emit(value);
        },
        selection      : (value) => {
          this.selection.emit(value.selection);
        },
      }
    );
  }

  get engineModel() {
    return this.engine.getModel();
  }

  @Input()
  set engineModel(value: any) {
    this.engine.setModel(value);
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      merge(
        this.nodesUpdated.pipe(
        ),
        this.linksUpdated.pipe(
        ),
        this.portsUpdated.pipe(),
        this.positionChanged.pipe(
          filter((evt) => evt.entity instanceof DiagramNodeModel),
          debounceTime(200),
        )
      ).pipe(
        debounceTime(50),
        takeUntil(this.destroy$),
        tap((evt) => {
          this.zone.run(() => {
            this.stateChange.next(evt);
          });
        })
      ).subscribe();
    });
  }

  ngOnDestroy() {
    this.registerHandle.deregister();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.bindEngine();
  }

}
