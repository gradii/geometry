/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, TemplateRef
} from '@angular/core';
import { TRI_TREE_VIEW } from '../constants/types';
import { TreeNode, TreeUIOptions } from '../models';
import { TreeVirtualScroll } from '../services/tree-virtual-scroll.service';
import type { TreeComponent } from './tree.component';

@Component({
  selector : 'tri-tree-node-item',
  template : `
    <ng-template [ngIf]="!treeNodeWrapperTemplate">
      <tri-tree-node-toggle [index]="index"
                            [node]="node"
                            [options]="options"
                            [template]="expanderTemplate">
      </tri-tree-node-toggle>
      <tri-pseudo-checkbox
        *ngIf="options.selectionType === 'multiple' || options.selectionType === 'single'"
        [ngStyle]="{margin: '0 4px'}"
        (click)="toggleChecked($event)"
        [state]="node._indeterminate ? 'indeterminate' : node._checked ? 'checked' : 'unchecked'"
      ></tri-pseudo-checkbox>
      <tri-tree-node-content [node]="node"
                             [index]="index"
                             [options]="options"
                             [template]="treeNodeTemplate">
      </tri-tree-node-content>
    </ng-template>

    <ng-container [ngTemplateOutlet]="treeNodeWrapperTemplate"
                  [ngTemplateOutletContext]="{$implicit: null,
                                              node: node,
                                              index: index,
                                              options: options}">
    </ng-container>
  `,
  host     : {
    '[class.tree-node-wrapper]': 'className'
  },
  styleUrls: ['../../style/components/tree-node-wrapper.component.css'],
})
export class TreeNodeItemComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() node: TreeNode;
  @Input() options: TreeUIOptions;
  @Input() index: number;

  className = true;

  constructor(private virtualScroll: TreeVirtualScroll,
              private elementRef: ElementRef,
              @Inject(TRI_TREE_VIEW) private tree: TreeComponent
  ) {
  }

  get expanderTemplate(): TemplateRef<any> {
    return this.tree.expanderTemplate;
  }

  get treeNodeTemplate(): TemplateRef<any> {
    return this.tree.treeNodeTemplate;
  }

  get treeNodeWrapperTemplate(): TemplateRef<any> {
    return this.tree.treeNodeWrapperTemplate;
  }

  toggleChecked(event: MouseEvent) {
    event.preventDefault();

    if (event.button === 0) {

      // this.
      // setTimeout(() => {
      this.node.isChecked = !this.node.isChecked;
      // })
      // this.node.treeModel.
      // this.cdRef.markForCheck()
    }
  }

  ngOnInit() {
    this.node.elementRef = this.elementRef;
  }

  ngOnDestroy() {
    this.node.elementRef = null;
  }

  ngAfterViewInit() {
    if (!this.virtualScroll.isDisabled() && !this.virtualScroll.hasEnoughNodeHeight) {
      this.virtualScroll.reportNodeHeight(
        this.elementRef.nativeElement.getBoundingClientRect().height);
    }
  }
}
