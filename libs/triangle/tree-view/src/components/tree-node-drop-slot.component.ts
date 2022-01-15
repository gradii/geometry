/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  Input
} from '@angular/core';
import { isFunction } from '@gradii/check-type';
import {
  DragAndDropEvent,
  TreeNode,
  TreeUIOptions
} from '../models';

@Component({
  selector   : 'tri-tree-node-drop-slot',
  template: `
    <div triTreeViewDrop
         (treeViewDrop)="onDrop($event)"
         [treeAllowDrop]="allowDrop"
         class="tree-node-drop-slot">
    </div>
  `,
  styleUrls  : ['../../style/components/tree-node-drop-slot.component.scss'],

})
export class TreeNodeDropSlotComponent {
  @Input() node: TreeNode;
  @Input() options: TreeUIOptions;
  @Input() dropIndex: number;

  allowDrop = (element: TreeNode, $event: DragEvent) =>
    isFunction(this.options.allowDrop)
      ? this.options.allowDrop(element, {
        parent: this.node,
        index : this.dropIndex,
      }, $event)
      : false;

  onDrop($event: DragAndDropEvent) {
    this.node.mouseAction('drop', $event.event, {
      from: $event.element,
      to  : {parent: this.node, index: this.dropIndex},
    });
  }
}
