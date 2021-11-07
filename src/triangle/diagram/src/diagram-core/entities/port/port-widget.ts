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
  AfterViewChecked, Component, DoCheck, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { ListenerHandle } from '../../../canvas-core/core/base-observer';
import { ENGINE } from '../../../canvas-core/tokens';
import { Toolkit } from '../../../canvas-core/toolkit';
import { DiagramEngine } from '../../diagram-engine';
import { PortModel } from './port-model';

@Component({
  selector: 'port-widget',
  template: `
    <div
      #ref
      class="port"
      [attr.data-name]="port.getName()"
      [attr.data-nodeid]="port.getNode().getID()"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class PortWidget implements OnInit, OnDestroy, DoCheck, AfterViewChecked {
  @ViewChild('ref', {read: ElementRef, static: true})
  ref: ElementRef<HTMLDivElement>;
  @Input() port: PortModel;
  private engineListenerHandle: ListenerHandle;

  constructor(@Inject(ENGINE) public engine: DiagramEngine) {
  }

  report() {
    this.port.updateCoords(this.engine.getPortCoords(this.port, this.ref.nativeElement));
  }

  getExtraProps() {
    if (Toolkit.TESTING) {
      const links = Object.keys(this.port.getNode().getPort(this.port.getName()).links).join(',');
      return {
        'data-links': links
      };
    }
    return {};
  }

  //
  // componentDidUpdate(prevProps: Readonly<PortProps>, prevState, snapshot?: any): void {
  //   if (!this.port.reportedPosition) {
  //     this.report();
  //   }
  // }
  //

  ngDoCheck() {
  }

  ngAfterViewChecked() {
    // if (!this.port.reportedPosition) {
    //   this.report();
    // }
  }

  ngOnInit(): void {
    this.engineListenerHandle = this.engine.registerListener({
      canvasReady: () => {
        this.report();
      }
    });
    if (this.engine.getCanvas()) {
      this.report();
    }
  }

  ngOnDestroy() {
    if (this.engineListenerHandle) {
      this.engineListenerHandle.deregister();
      this.engineListenerHandle = undefined;
    }
  }

}
