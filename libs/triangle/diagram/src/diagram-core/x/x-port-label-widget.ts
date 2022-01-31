/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input, ViewChild } from '@angular/core';
import { DiagramPortModel } from '../../models/diagram-port-model';
import { DiagramEngine } from '../diagram-engine';
import { PortWidget } from '../entities/port/port-widget';
//
// export interface DefaultPortLabelProps {
//   port: DefaultPortModel;
//   engine: DiagramEngine;
// }
//
// namespace S {
//   export const PortLabel = styled.div`
// 		display: flex;
// 		margin-top: 1px;
// 		align-items: center;
// 	`;
//
//   export const Label = styled.div`
// 		padding: 0 5px;
// 		flex-grow: 1;
// 	`;
//
//   export const Port = styled.div`
// 		width: 15px;
// 		height: 15px;
// 		background: rgba(255, 255, 255, 0.1);
//
// 		&:hover {
// 			background: rgb(192, 255, 0);
// 		}
// 	`;
// }


@Component({
  selector: 'x-port-label-widget',
  template: `
    <div class="portLabel">
      <ng-container *ngIf="port.in">
        <port-widget [port]="port">
          <div class="port-inner port-inner-in"></div>
        </port-widget>
        <div class="label">{{port.displayName}}</div>
      </ng-container>
      <ng-container *ngIf="!port.in">
        <div class="label">{{port.displayName}}</div>
        <port-widget [port]="port">
          <div class="port-inner port-inner-out"></div>
        </port-widget>
      </ng-container>
    </div>
  `,
  styles  : [
    `
      .portLabel {
        display     : flex;
        margin-top  : 1px;
        align-items : center;
      }

      .label {
        padding   : 0 5px;
        flex-grow : 1;
      }

    `
  ]
})
export class XPortLabelWidget {
  @Input() port: DiagramPortModel;
  @Input() engine: DiagramEngine;

  @ViewChild(PortWidget, {static: false})
  portWidget: PortWidget;

  report() {
    if (this.portWidget) {
      this.portWidget.report();
    }
  }
}
