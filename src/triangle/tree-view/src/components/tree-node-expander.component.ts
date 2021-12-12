/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit,
  TemplateRef
} from '@angular/core';
import { merge, Subscription } from 'rxjs';

import { TreeEvent, TreeNode, TreeUIOptions } from '../models';

@Component({
  selector       : 'tri-tree-node-expander',
  template       : `
    <ng-template [ngIf]="!template">
      <div (click)="node.mouseAction('expanderClick', $event)"
           *ngIf="node.hasChildren"
           [class.toggle-children-collapsed]="node.isCollapsed"
           [class.toggle-children-expanded]="node.isExpanded"
           class="toggle-children-wrapper">
        <tri-icon class="toggle-children" svgIcon="outline:caret-right"></tri-icon>
      </div>

      <div *ngIf="!node.hasChildren"
           class="toggle-children-placeholder"></div>
    </ng-template>

    <ng-container [ngTemplateOutletContext]="{
                $implicit: null,
                node: node,
                index: index,
                options: options
              }"
                  [ngTemplateOutlet]="template">
    </ng-container>

  `,
  styleUrls      : ['../../style/components/tree-node-expander.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeNodeExpanderComponent implements OnInit, OnDestroy {
  @Input() options: TreeUIOptions;
  @Input() node: TreeNode;
  @Input() index: number;
  @Input() template: TemplateRef<any>;

  @HostBinding('class.tree-node-expander') className = true;

  private structureChangeSub = Subscription.EMPTY;
  private toggleChangeSub    = Subscription.EMPTY;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.node.treeModel) {
      this.structureChangeSub = merge<TreeEvent>(
        this.node.treeModel.events.addNode,
        this.node.treeModel.events.removeNode,
      )
        .subscribe((event: TreeEvent) => {
          if (event.node && event.node.parent === this.node) {
            this.cdRef.markForCheck();
          }
        });
      this.toggleChangeSub    = merge<TreeEvent>(
        this.node.treeModel.events.expand,
        this.node.treeModel.events.collapse,
      )
        .subscribe((event: TreeEvent) => {
          if (event.node && event.node === this.node) {
            this.cdRef.markForCheck();
          }
        });
    }
  }

  ngOnDestroy() {
    this.structureChangeSub.unsubscribe();
    this.toggleChangeSub.unsubscribe();
  }
}
