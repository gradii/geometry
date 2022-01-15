/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, ElementRef, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmPopupDirective } from '@gradii/triangle/confirm-popup';
import { TriDialogService } from '@gradii/triangle/dialog';
import { PopoverDirective } from '@gradii/triangle/popover';
import { BaseEntityEvent } from '../../../canvas-core/core-models/base-entity';
import { BaseModel } from '../../../canvas-core/core-models/base-model';
import { ListenerHandle } from '../../../canvas-core/core/base-observer';
import type { CanvasWidget } from '../../../canvas-core/entities/canvas/canvas-widget';
import { CANVAS_WIDGET, ENGINE } from '../../../canvas-core/tokens';
import { DiagramNodeModel } from '../../../models/diagram-node-model';
import { DiagramEngine } from '../../diagram-engine';
import { NodeModel } from './node-model';

@Component({
  selector: 'node-widget',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template : `
    <div class="node"
         #ref
         #nodeConfirmPopup="triConfirmPopup"
         #nodeContextMenu="triContextMenuTriggerFor"
         [triConfirmPopup]="confirmPopupTpl"
         [triConfirmPopupTrigger]="'noop'"
         (onConfirm)="onConfirm(node, inputValue)"
         (onCancel)="onCancel()"
         [triContextMenuTriggerFor]="context_menu"
         [attr.data-nodeid]="node.getID()"
         [style.top.px]="node.getY()"
         [style.left.px]="node.getX()">
      <!--      <ng-template [ngTemplateOutlet]="engine.generateWIdgetForNode(node)"></ng-template>-->
      <!--      <ng-template [ngTemplateOutlet]="engine.generateWidgetForNode(node)"-->
      <!--                   [ngTemplateOutletContext]="{event: {model: node}}"></ng-template>-->
      <x-node-widget [node]="node"></x-node-widget>
    </div>
    <ng-template #confirmPopupTpl>
      <textarea name="description" triTextarea [(ngModel)]="inputValue"
                [rows]="4"
                [placeholder]="''"></textarea>
    </ng-template>

    <ng-template #context_menu="triMenuPanel" triMenuPanel>
      <div class="node-menu" triMenu [triMenuPanel]="context_menu">
        <button class="node-menu-item" triMenuItem>Cut</button>
        <button class="node-menu-item" triMenuItem>Copy</button>
        <button class="node-menu-item" triMenuItem>Link</button>
        <button class="node-menu-item" triMenuItem
                (click)="nodeContextMenu.close();">Edit Label</button>
        <button class="node-menu-item" triMenuItem
                (click)="nodeContextMenu.close();onEditDescription(node);">Edit Description
        </button>
        <hr/>
        <button class="node-menu-item"
                triMenuItem
                [triMenuTriggerFor]="input_menu">Add Input Port
        </button>
        <button class="node-menu-item"
                triMenuItem
                [triMenuTriggerFor]="output_menu">Add Output Port
        </button>
      </div>
    </ng-template>
    <ng-template #input_menu="triMenuPanel" triMenuPanel>
      <div class="node-menu" triMenu [triMenuPanel]="input_menu">
        <button class="node-menu-item" triMenuItem (click)="onAddInput('text')">Text</button>
        <button class="node-menu-item" triMenuItem>
          <tri-icon svgIcon="outline:close-circle"></tri-icon>
          Error
        </button>
      </div>
    </ng-template>
    <ng-template #output_menu="triMenuPanel" triMenuPanel>
      <div class="node-menu" triMenu [triMenuPanel]="output_menu">
        <button class="node-menu-item" triMenuItem>Text</button>
        <button class="node-menu-item" triMenuItem>String</button>
      </div>
    </ng-template>

    <ng-template #dialog>
      <tri-card>
        <tri-card-header>sdf</tri-card-header>
        <tri-card-body>
          sdf
        </tri-card-body>
      </tri-card>
    </ng-template>
  `,
  styles   : [
    `.node {
      position              : absolute;
      -webkit-touch-callout : none;
      user-select           : none;
      cursor                : move;
      pointer-events        : all;
    }`
  ],
  styleUrls: ['../../../../style/node-widget.scss']
})
export class NodeWidget {
  ob: any;
  ref: ElementRef<HTMLDivElement>;
  listener: ListenerHandle;

  @Input() node: DiagramNodeModel;
  @Input() children?: any;

  @ViewChild('dialog', {read: TemplateRef, static: true})
  dialogTemplateRef: TemplateRef<any>;

  @ViewChild('nodeConfirmPopup', {read: ConfirmPopupDirective, static: true})
  editDescConfirmPopup: ConfirmPopupDirective;

  @ViewChild('nodePopover', {read: PopoverDirective, static: true})
  nodePopover: PopoverDirective;

  // @Input() diagramEngine: DiagramEngine;

  inputValue = '';
  inputLabelValue = '';

  constructor(
    @Inject(ENGINE) public engine: DiagramEngine,
    @Inject(CANVAS_WIDGET) private canvasWidget: CanvasWidget,
    private dialogService: TriDialogService
  ) {
  }

  onAddInput(type: string) {
    this.node.addInPort(type, type);
    this.engine.repaintCanvas();
  }

  onConfirm(node: DiagramNodeModel, value: string) {
    node.description = value;
    this.restoreDetach();
  }

  onCancel() {
    this.inputValue = '';
    this.restoreDetach();
  }

  onEditDescription(node: DiagramNodeModel) {
    this.reattach();
    // should disable engine any another operator

    this.inputValue = node.description;
    this.editDescConfirmPopup.show(0);
    this.engine.repaintCanvas();

    // // since diagram detach cd. need manual trigger it. default show delay is 100
    // setTimeout(() => {
    //   this.engine.repaintCanvas();
    // }, 20);
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

  private reattach() {
    this.canvasWidget.cdRef.reattach();
  }

  private restoreDetach() {
    setTimeout(() => {
      this.canvasWidget.cdRef.detach();
    }, 200);
  }

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
