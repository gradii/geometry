/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, Input } from '@angular/core';
import { ENGINE } from '../../canvas-core/tokens';
import { DiagramNodeModel } from '../../models/diagram-node-model';
import { DiagramEngine } from '../diagram-engine';

/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */
@Component({
  selector: 'x-node-widget',
  template: `
    <div class="title">
      <div class="titleName">
        {{node.name}}
      </div>
    </div>
    <div class="description">
      
    </div>
    <div class="ports">
      <div class="portsContainer">
        <ng-container *ngFor="let it of node.getInPorts()">
          <x-port-label-widget [port]="it"></x-port-label-widget>
        </ng-container>
      </div>
      <div class="portsContainer">
        <ng-container *ngFor="let it of node.getOutPorts()">
          <x-port-label-widget [port]="it"></x-port-label-widget>
        </ng-container>
      </div>
    </div>
  `,
  host    : {
    '[style.borderColor]'       : 'node.isSelected() ? "rgb(0,192,255)" : "black"',
    '[style.backgroundColor]'   : 'node.color',
    '[attr.dataDefaultNodeName]': 'node.name',
    '[attr.selected]'           : 'node.isSelected()',
  },
  styles  : [
    `:host {
      border-radius : 5px;
      font-family   : sans-serif;
      color         : white;
      border        : 2px solid black;
      overflow      : visible;
      font-size     : 11px;
      display       : block;
    }

    .title {
      background    : rgba(0, 0, 0, 0.3);
      display       : flex;
      white-space   : nowrap;
      justify-items : center;
    }

    .titleName {
      flex-grow : 1;
      padding   : 5px 5px;
    }

    .ports {
      display          : flex;
      background-image : linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
    }

    .portsContainer {
      flex-grow      : 1;
      display        : flex;
      flex-direction : column;
    }

    .portsContainer:first-of-type {
      margin-right : 10px;
    }

    .portsContainer:only-child {
      margin-right : 0;
    }

    `
  ]
})
export class XNodeWidget {

  @Input() node: DiagramNodeModel;

  constructor(@Inject(ENGINE) public engine: DiagramEngine) {
  }


  // todo removeme noneed
  // generatePort(port: any) {
  //   return {
  //     port: port,
  //     key: port.getID()
  //   };
  //   // return {
  //   //   component: DefaultPortLabel,
  //   //   props: {
  //   //     engine: this.engine,
  //   //     port: port,
  //   //     key: port.getID()
  //   //   }
  //   // };
  // }

  // render() {
  //   return (
  //     <S.Node
  //       data-default-node-name={this.props.node.getOptions().name}
  //   selected={this.props.node.isSelected()}
  //   background={this.props.node.getOptions().color}>
  //     <S.Title>
  //       <S.TitleName>{this.props.node.getOptions().name}</S.TitleName>
  //     </S.Title>
  //     <S.Ports>
  //     <S.PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</S.PortsContainer>
  //     <S.PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</S.PortsContainer>
  //     </S.Ports>
  //     </S.Node>
  // );
  // }
}
