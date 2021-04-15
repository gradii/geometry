/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectionStrategy, Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { TreeNode, TreeUIOptions } from '../../models';

@Component({
  selector       : 'tri-tree-node-content',
  templateUrl    : './tree-node-content.component.html',
  styleUrls      : ['../../../style/components/tree-node-content.component.css'],

})
export class TreeNodeContentComponent {
  @Input() options: TreeUIOptions;
  @Input() node: TreeNode;
  @Input() index: number;
  @Input() template: TemplateRef<any>;
  @HostBinding('class.tree-node-content') className = true;
}
