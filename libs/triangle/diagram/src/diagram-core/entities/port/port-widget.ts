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
    <div class="port-wrapper">
      <ng-content></ng-content>
    </div>
  `,
  styles  : [
    `
      :host {
        display : inline-flex;
      }

      .port-wrapper {
        position   : relative;
        width      : 15px;
        height     : 15px;
        background : rgba(255, 255, 255, 0.2);
      }

      .port-wrapper:hover {
        background : rgb(192, 255, 0);
      }
    `
  ],
  host    : {
    'class'              : 'port',
    '[class.port-linked]': 'port.getLinks().size',
    '[attr.data-name]'   : 'port.getName()',
    '[attr.data-nodeid]' : 'port.getNode().getID()'
  }
})
export class PortWidget implements OnInit, OnDestroy, DoCheck, AfterViewChecked {
  @ViewChild('ref', {read: ElementRef, static: true})
  ref: ElementRef<HTMLDivElement>;

  @Input() port: PortModel;

  private engineListenerHandle: ListenerHandle;

  constructor(@Inject(ENGINE) public engine: DiagramEngine,
              private elementRef: ElementRef
  ) {
  }

  report() {
    this.port.updateCoords(this.engine.getPortCoords(this.port, this.elementRef.nativeElement));
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
