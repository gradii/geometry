/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { TreeNode } from '../models';

@Component({
  selector : 'tri-tree-loading',
  template : `
    <span *ngIf="!template">loading...</span>

    <ng-container
      [ngTemplateOutletContext]="{ $implicit: null, node: node }"
      [ngTemplateOutlet]="template">
    </ng-container>
  `,
  styleUrls: ['../../style/components/tree-loading.component.scss'],

})
export class TreeLoadingComponent {
  @Input() template: TemplateRef<any>;
  @Input() node: TreeNode;

  @HostBinding('class.tree-loading') className = true;
}
