/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TreeNode } from './tree-node';

export interface TreeEvent {
  eventName: string;
  node?: TreeNode;
  isExpanded?: boolean;
  isSelected?: boolean;
  to?: { parent: TreeNode; index: number };
}

export interface DragAndDropEvent {
  event: MouseEvent;
  element: TreeNode | null;
}
