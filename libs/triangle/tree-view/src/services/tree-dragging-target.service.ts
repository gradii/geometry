/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TreeNode } from '../models';

@Injectable()
export class TreeDraggingTargetService extends Subject<TreeNode> {
  _draggedElement: TreeNode | null = null;

  set(draggedElement: TreeNode | null) {
    this._draggedElement = draggedElement;
  }

  get() {
    return this._draggedElement;
  }

  isDragging() {
    return !!this.get();
  }
}
