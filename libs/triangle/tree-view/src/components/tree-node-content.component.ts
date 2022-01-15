/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { TreeNode, TreeUIOptions } from '../models';

@Component({
  selector : 'tri-tree-node-content',
  template : `
    <span *ngIf="!template">{{ node.displayField }}</span>

    <ng-container
      [ngTemplateOutletContext]="{ $implicit: null, node: node, index: index, options: options }"
      [ngTemplateOutlet]="template">
    </ng-container>

  `,
  styleUrls: ['../../style/components/tree-node-content.component.scss'],

})
export class TreeNodeContentComponent {
  @Input() options: TreeUIOptions;
  @Input() node: TreeNode;
  @Input() index: number;
  @Input() template: TemplateRef<any>;
  @HostBinding('class.tree-node-content') className = true;
}
