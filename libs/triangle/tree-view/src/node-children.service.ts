/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Subject } from 'rxjs';
import { TreeItem } from './treeitem.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class NodeChildrenService {
  changes: Subject<{item: TreeItem; children: TreeItem[]; }>;

  /**
   * @hidden
   */
  constructor() {
    this.changes = new Subject();
  }

  childrenLoaded(item: TreeItem, children: TreeItem[]) {
    this.changes.next({ item, children });
  }
}
