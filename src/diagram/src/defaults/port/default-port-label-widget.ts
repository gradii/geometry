import { Component, Input } from '@angular/core';
import { DiagramEngine } from '../../diagram-core/diagram-engine';
import { DefaultPortModel } from './default-port-model';
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
  selector: 'default-port-label',
  template: `
    <div class="portLabel">
      <ng-container *ngIf="port.getOptions().in">
        <port-widget [port]="port">
          <div class="port"></div>
        </port-widget>
        <div class="label">{{port.getOptions().label}}</div>
      </ng-container>
      <ng-container *ngIf="!port.getOptions().in">
        <div class="label">{{port.getOptions().label}}</div>
        <port-widget [port]="port">
          <div class="port"></div>
        </port-widget>
      </ng-container>
    </div>
  `,
  styles: [`
    .portLabel {
      display: flex;
      margin-top: 1px;
      align-items: center;
    }

    .port {
      width: 15px;
      height: 15px;
      background: rgba(255, 255, 255, 0.1);
    }

    .port:hover {
      background: rgb(192, 255, 0);
    }

    .label {
      padding: 0 5px;
      flex-grow: 1;
    }

  `]
})
export class DefaultPortLabelWidget {
  @Input() port: DefaultPortModel;
  @Input() engine: DiagramEngine;
}
