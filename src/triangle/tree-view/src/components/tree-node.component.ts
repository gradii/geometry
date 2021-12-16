/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef, Component, HostBinding, Inject, Input, OnChanges, OnDestroy, OnInit,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { isFunction } from '@gradii/check-type';
import { merge, Subscription } from 'rxjs';
import { TRI_TREE_VIEW } from '../constants/types';

import { TreeEvent, TreeNode, TreeUIOptions } from '../models';
import { PosPair, TreeVirtualScroll } from '../services/tree-virtual-scroll.service';
import { binarySearch } from '../util';
import type { TreeComponent } from './tree.component';

@Component({
  selector : 'tri-tree-node',
  template : `
    <ng-template [ngIf]="!treeNodeFullTemplate">
      <tri-tree-node-item
        (click)="node.mouseAction('click', $event)"
        (contextmenu)="node.mouseAction('contextMenu', $event)"
        (dblclick)="node.mouseAction('dblClick', $event)"
        triTreeViewDrop
        (treeViewDrop)="node.onDrop($event)"
        (treeDropDragEnter)="node.mouseAction('dragEnter', $event)"
        (treeDropDragLeave)="node.mouseAction('dragLeave', $event)"
        (treeDropDragOver)="node.mouseAction('dragOver', $event)"
        [class.tree-node-wrapper-active]="node.isActive"
        [class.tree-node-wrapper-focused]="node.isFocused"
        [index]="index"
        triTreeViewDrag
        [treeViewDrag]="node"
        [node]="node"
        [options]="options"
        [style.padding-left]="options.levelPadding!(node)"
        [treeAllowDrop]="allowDrop"
        [treeDragEnabled]="allowDrag(node)">
      </tri-tree-node-item>

      <tri-tree-node-children
        *ngIf="node.isExpanded && node.hasVisibleChildren"
        [children]="node.visibleChildren"
        [node]="node"
        [options]="options"></tri-tree-node-children>
    </ng-template>

    <ng-container
      [ngTemplateOutletContext]="{$implicit: null,
                                  node: node,
                                  index: index,
                                  options: options}"
      [ngTemplateOutlet]="treeNodeFullTemplate">
    </ng-container>
  `,
  styleUrls: ['../../style/components/tree-node.component.css'],

})
export class TreeNodeComponent implements OnInit, OnDestroy {
  @Input() node: TreeNode;
  @Input() options: TreeUIOptions;
  @Input() index: number;

  @HostBinding('class.tree-node') className = true;
  private operationSub                      = Subscription.EMPTY;

  constructor(private cdRef: ChangeDetectorRef,
              @Inject(TRI_TREE_VIEW) private tree: TreeComponent) {
  }

  get allowDrop() {
    return (node: TreeNode, $event?: DragEvent) => {
      return isFunction(this.options.allowDrop)
        ? this.options.allowDrop(node, {parent: this.node, index: node.index}, $event)
        : this.options.allowDrop;
    };
  }

  get treeNodeFullTemplate(): TemplateRef<any> {
    return this.tree.treeNodeFullTemplate;
  }

  ngOnInit() {
    if (this.node.treeModel) {
      this.operationSub = merge<TreeEvent>(
        this.node.treeModel.events.expand,
        this.node.treeModel.events.collapse,
        this.node.treeModel.events.activate,
        this.node.treeModel.events.deactivate,
        this.node.treeModel.events.focus,
        this.node.treeModel.events.blur
      ).subscribe((evt: TreeEvent) => {
        if (evt.node && evt.node === this.node) {
          this.cdRef.markForCheck();
        }
      });
    }
  }

  ngOnDestroy() {
    this.operationSub.unsubscribe();
  }

  allowDrag(node: TreeNode) {
    return isFunction(this.options.allowDrag) ? this.options.allowDrag(
      node) : this.options.allowDrag;
  }
}


/** Time and timing curve for expansion panel animations. */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

@Component({
  selector  : 'tri-tree-node-children',
  template  : `
    <tri-tree-node *ngFor="let child of viewportNodes; let i = index; trackBy: trackNode"
                   [class.tree-node-active]="child.isActive"
                   [class.tree-node-collapsed]="child.isCollapsed"
                   [class.tree-node-expanded]="child.isExpanded"
                   [class.tree-node-focused]="child.isFocused"
                   [class.tree-node-leaf]="child.isLeaf"
                   [index]="i"
                   [ngClass]="[options.nodeClass!(child), 'tree-node-level-'+ child.level]"
                   [node]="child"
                   [options]="options">
    </tri-tree-node>

    <tri-tree-loading *ngIf="!node.children"
                      [node]="node"
                      [style.padding-left]="options.levelPadding!(node)"
                      [template]="loadingTemplate"></tri-tree-loading>
  `,
  styleUrls : ['../../style/components/tree-node-children.component.css'],
  host      : {
    '[@expandAnimation]'              : 'expandAnimation',
    '[class.tree-node-children]'      : 'className',
    '[class.tree-children-no-padding]': 'noPadding',
    '[style.margin-top.px]'           : 'marginTopAttr',
  },
  animations: [
    trigger('expandAnimation', [
      transition(':enter', [
        style({height: 0, overflow: 'hidden'}),
        animate(EXPANSION_PANEL_ANIMATION_TIMING, style({height: '*'})),
      ]),
      transition(':leave', [
        style({height: '*', overflow: 'hidden'}),
        animate(EXPANSION_PANEL_ANIMATION_TIMING, style({height: 0})),
      ]),
    ]),
  ],

})
export class TreeNodeChildrenComponent implements OnInit, OnChanges, OnDestroy {
  marginTop                 = 0;
  viewportNodes: TreeNode[] = [];

  @Input() options: TreeUIOptions;
  @Input() node: TreeNode;
  @Input() disableMarginTop = false;
  @Input() children: TreeNode[];
  @Input() refreshTree      = false;

  expandAnimation = true;

  className = true;

  private scrollSub = Subscription.EMPTY;

  constructor(private virtualScroll: TreeVirtualScroll,
              private cdRef: ChangeDetectorRef,
              @Inject(TRI_TREE_VIEW) private tree: TreeComponent) {
  }

  get noPadding() {
    return !this.options.levelPadding;
  }

  get marginTopAttr() {
    return this.disableMarginTop ? 0 : this.marginTop;
  }

  get loadingTemplate() {
    return this.tree.loadingTemplate;
  }

  ngOnInit() {
    this.viewportNodes = this.children;
    this.scrollSub     = this.virtualScroll.waitForCollection((metrics: PosPair) => {
      if (this.node.treeModel && this.node.isExpanded) {
        // here we directly access node's visibleChildren but not component's `children`
        // property is, because it will only be updated on next lifecycle check, which is
        // after the collection notification
        this.viewportNodes = this.getViewportNodes(this.node.visibleChildren, metrics);
        this.marginTop     = this.calcMarginTop();
        this.cdRef.markForCheck();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('children' in changes && changes.children.currentValue) {
      this.viewportNodes = this.virtualScroll.isDisabled() || this.refreshTree
        ? this.children : this.viewportNodes;
    }
  }

  ngOnDestroy() {
    this.scrollSub.unsubscribe();
  }

  trackNode(index: number, node: TreeNode) {
    return node.id;
  }

  calcMarginTop() {
    const firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0];

    // condition on root node is because the virtual root's self height is 0
    return firstNode
      ? Math.max(0, firstNode.position - firstNode.parent!.position -
        (firstNode.parent!.isRoot ? 0 : this.virtualScroll.averageNodeHeight))
      : 0;
  }

  getViewportNodes(nodes: TreeNode[], {startPos, endPos}: PosPair) {
    if (!nodes || !nodes.length) {
      return [];
    }

    // Search for first node in the viewport using binary search
    // Look for first node that starts after the beginning of the viewport (with buffer)
    // Or that ends after the beginning of the viewport
    const firstIndex = binarySearch(nodes, (node) => {
      return startPos <= node.position || (startPos <= node.position + node.height);
    });

    // Search for last node in the viewport using binary search
    // Look for first node that starts after the end of the viewport (with buffer)
    const lastIndex = binarySearch(nodes, (node) => {
      return endPos < node.position || (endPos <= node.position + node.height);
    }, firstIndex);

    const viewportNodes = nodes.slice(firstIndex, lastIndex + 1);

    // console.log(this.node.id, 'first: ', firstIndex, 'last: ', lastIndex, viewportNodes)

    return viewportNodes;
  }
}
