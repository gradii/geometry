/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, ElementRef, Inject, Input } from '@angular/core';
import { BaseEntityEvent } from '../../../canvas-core/core-models/base-entity';
import { BaseModel } from '../../../canvas-core/core-models/base-model';
import { ENGINE } from '../../../canvas-core/tokens';
import { ListenerHandle } from '../../../canvas-core/core/base-observer';
import { DefaultNodeModel } from '../../../models/default-node-model';
import { DiagramEngine } from '../../diagram-engine';
import { NodeModel } from './node-model';

@Component({
  selector: 'node-widget',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="node"
         #ref
         [attr.data-nodeid]="node.getID()"
         [style.top.px]="node.getY()"
         [style.left.px]="node.getX()">
      <!--      <ng-template [ngTemplateOutlet]="engine.generateWIdgetForNode(node)"></ng-template>-->
<!--      <ng-template [ngTemplateOutlet]="engine.generateWidgetForNode(node)"-->
<!--                   [ngTemplateOutletContext]="{event: {model: node}}"></ng-template>-->
      <x-node-widget [node]="node"></x-node-widget>
    </div>
  `,
  styles: [`
    .node {
      position              : absolute;
      -webkit-touch-callout : none;
      user-select           : none;
      cursor                : move;
      pointer-events        : all;
    }
  `]
})
export class NodeWidget {
  ob: any;
  ref: ElementRef<HTMLDivElement>;
  listener: ListenerHandle;

  @Input() node: DefaultNodeModel;
  @Input() children?: any;

  // @Input() diagramEngine: DiagramEngine;

  constructor(@Inject(ENGINE) public engine: DiagramEngine) {
  }

  // constructor(props: NodeProps) {
  //   super(props);
  //   this.ref = React.createRef();
  // }

  // componentWillUnmount(): void {
  //   this.ob.disconnect();
  //   this.ob = null;
  //
  //   this.listener.deregister();
  //   this.listener = null;
  // }
  //
  // componentDidUpdate(prevProps: Readonly<NodeProps>, prevState: Readonly<any>, snapshot?: any): void {
  //   if (this.listener && this.node !== prevProps.node) {
  //     this.listener.deregister();
  //     this.installSelectionListener();
  //   }
  // }

  installSelectionListener() {
    // @ts-ignore
    this.listener = this.node.registerListener({
      selectionChanged: (event: BaseEntityEvent<BaseModel> & { isSelected: boolean }) => {
        // this.forceUpdate();
      }
    });
  }

  // componentDidMount(): void {
  //   // @ts-ignore
  //   this.ob = new ResizeObserver((entities) => {
  //     const bounds = entities[0].contentRect;
  //     this.node.updateDimensions({width: bounds.width, height: bounds.height});
  //
  //     // now mark the links as dirty
  //     _.forEach(this.node.getPorts(), (port) => {
  //       port.updateCoords(this.diagramEngine.getPortCoords(port));
  //     });
  //   });
  //   this.ob.observe(this.ref.current);
  //   this.installSelectionListener();
  // }

  static ngAcceptInputType_node: NodeModel;
}