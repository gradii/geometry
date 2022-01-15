/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy, Component, ContentChild, EventEmitter, forwardRef, Input, OnChanges,
  OnDestroy, Output, SimpleChanges, TemplateRef, ViewChild,
} from '@angular/core';
import { isAnyEmpty, isBlank } from '@gradii/check-type';
import { EventsMap, TREE_EVENTS } from '../constants/events';
import { TRI_TREE_VIEW } from '../constants/types';
import {
  createTreeUIOptions, IAllowDragFn, IAllowDropFn, ILevelPaddingFn, TreeDataOptions, TreeEvent,
  TreeModel, TreeNode, TreeUIOptions,
} from '../models';
import { TreeDraggingTargetService } from '../services/tree-dragging-target.service';
import { TreeNodeChildrenComponent } from './tree-node.component';
import { TreeViewportComponent } from './tree-viewport.component';

@Component({
  selector       : 'tri-tree-view',
  template       : `
    <tri-tree-viewport #viewport="triTreeViewport"
                       [@.disabled]="!enableAnimation || viewport.isScrolling"
                       [auditViewportUpdate]="UIOptions.auditViewportUpdate"
                       [enable]="useVirtualScroll"
                       [referenceItemHeight]="UIOptions.referenceItemHeight"
                       [treeModel]="treeModel">
      <div *ngIf="!viewport.virtualScroll.isDisabled()"
           [style.height.px]="treeModel?.virtualRoot.height"
           class="height-raiser"></div>
      <div [class.node-dragging]="treeDraggingTargetService.isDragging()"
           [class.virtual-scroll-disabled]="viewport.virtualScroll.isDisabled()"
           [style.transform]="'translateY(' + root.marginTop + 'px)'"
           class="tree-root">
        <tri-tree-node-children #root
                                [children]="treeModel?.roots"
                                [disableMarginTop]="true"
                                [node]="treeModel?.virtualRoot"
                                [options]="UIOptions"
                                [refreshTree]="refreshTree">
        </tri-tree-node-children>
      </div>
    </tri-tree-viewport>
  `,
  styleUrls      : ['../../style/components/tree.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [
    {
      provide    : TRI_TREE_VIEW,
      useExisting: forwardRef(() => TreeComponent),
    }
  ],
  host           : {
    '[class.tri-tree-view]': 'true',
    '(body: keydown)'      : 'onKeydown($event)',
    '(body: mousedown)'    : 'onMousedown($event)',
  }
})
export class TreeComponent implements OnChanges, OnDestroy {
  emitterMap: EventsMap;
  treeModel: TreeModel = null as any;
  UIOptions: TreeUIOptions;
  refreshTree          = false;

  /**
   * source data
   */
  @Input() nodes: any[];
  /**
   * id of the node to be focused on
   */
  @Input() focusTarget: string;
  /**
   * id of the node to be activated
   */
  @Input() activateTarget: string;
  @Input() dataOptions: TreeDataOptions;

  @Input() allowDrag: boolean | IAllowDragFn;
  @Input() allowDrop: boolean | IAllowDropFn;
  @Input() levelPadding: number | ILevelPaddingFn;
  @Input() useVirtualScroll: boolean;
  @Input() referenceItemHeight: number;
  @Input() auditViewportUpdate?: number;
  @Input() nodeClass: (node: TreeNode) => string;
  @Input() enableAnimation                               = true;
  @Input() keepNodesExpanded                             = false;
  @Input() selectionType: 'none' | 'multiple' | 'single' = 'none';


  @Output() expand         = new EventEmitter<TreeEvent>();
  @Output() collapse       = new EventEmitter<TreeEvent>();
  @Output() selection      = new EventEmitter<TreeEvent>();
  @Output() toggleExpander = new EventEmitter<TreeEvent>();
  @Output() activate       = new EventEmitter<TreeEvent>();
  @Output() deactivate     = new EventEmitter<TreeEvent>();
  @Output() focus          = new EventEmitter<TreeEvent>();
  @Output() blur           = new EventEmitter<TreeEvent>();
  @Output() initialized    = new EventEmitter<TreeEvent>();
  @Output() moveNode       = new EventEmitter<TreeEvent>();
  @Output() loadChildren   = new EventEmitter<TreeEvent>();
  @Output() changeFilter   = new EventEmitter<TreeEvent>();
  @Output() addNode        = new EventEmitter<TreeEvent>();
  @Output() removeNode     = new EventEmitter<TreeEvent>();

  @ContentChild('loadingTemplate', {static: false}) loadingTemplate: TemplateRef<any>;
  @ContentChild('expanderTemplate', {static: false}) expanderTemplate: TemplateRef<any>;
  @ContentChild('treeNodeTemplate', {static: false}) treeNodeTemplate: TemplateRef<any>;
  @ContentChild('treeNodeWrapperTemplate',
    {static: false}) treeNodeWrapperTemplate: TemplateRef<any>;
  @ContentChild('treeNodeFullTemplate', {static: false}) treeNodeFullTemplate: TemplateRef<any>;

  @ViewChild('viewport', {static: true}) viewportComponent: TreeViewportComponent;
  @ViewChild('root', {static: true}) root: TreeNodeChildrenComponent;

  constructor(public treeDraggingTargetService: TreeDraggingTargetService) {
    this.emitterMap = (<(keyof typeof TREE_EVENTS)[]>Object.keys(TREE_EVENTS)).reduce(
      (map, name) => {
        if (!this.hasOwnProperty(name)) {
          throw new TypeError(`Unmatched events: [${name}]`);
        }

        this[name] = map[name] = new EventEmitter();

        return map;
      }, {} as EventsMap);

    this.UIOptions = createTreeUIOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nodes && changes.nodes.currentValue) {
      const oldTreeModel = this.treeModel;
      this.treeModel     = new TreeModel(changes.nodes.currentValue, this.emitterMap,
        this.dataOptions);
      if (oldTreeModel && this.keepNodesExpanded) {
        oldTreeModel.expandedNodes.forEach(node => {
          this.treeModel!.setExpandedNodeInPlace(node);
        });
      }
      if (!changes.nodes.isFirstChange()) {
        this.refreshTree = true;
      }
    } else if (changes.dataOptions && changes.dataOptions.currentValue && this.treeModel) {
      this.treeModel.updateOptions(changes.dataOptions.currentValue);
    }

    if (changes.focusTarget && changes.focusTarget.currentValue && this.treeModel) {
      this.treeModel.focusNode(this.focusTarget);
    }

    if (changes.activateTarget && changes.activateTarget.currentValue && this.treeModel) {
      this.treeModel.activateNode(this.activateTarget);
    }

    const uiOptions: any = {};
    [
      'allowDrag',
      'allowDrop',
      'levelPadding',
      'useVirtualScroll',
      'nodeClass',
      'referenceItemHeight',
      'auditViewportUpdate',
      'selectionType'
    ].forEach(it => {
      if ((it in changes) && !isBlank(changes[it].currentValue)) {
        uiOptions[it] = changes[it].currentValue;
      }
    });
    if (!isAnyEmpty(uiOptions)) {
      this.UIOptions = createTreeUIOptions(uiOptions);
    }
  }

  ngOnDestroy() {
    for (const emitter of Object.values(this.emitterMap)) {
      emitter.complete();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (!this.treeModel.isFocused) {
      return;
    }

    if (['input', 'textarea'].includes(document.activeElement!.tagName.toLowerCase())) {
      return;
    }

    const focusedNode = this.treeModel.focusedNode!;

    this.treeModel.performKeyAction(focusedNode, event);
  }

  onMousedown(event: MouseEvent) {
    const insideClick = (<HTMLElement>event.target)!.closest('tri-tree-view');

    if (!insideClick) {
      this.treeModel.setFocus(false);
    }
  }

  sizeChanged() {
    this.viewportComponent.setViewport();
  }

}
