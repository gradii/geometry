/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TreeItem } from './treeitem.interface';


export interface ItemLookup {
  /**
   * The current TreeItem instance
   */
  item: TreeItem;
  /**
   * The children of the current node
   */
  children?: TreeItem[];
  /**
   * The parent of the current node
   */
  parent?: ItemLookup;
}


export interface TreeItemLookup {
  /**
   *  The current TreeItem instance.
   */
  item: TreeItem;
  /**
   * The lookup details for the parent of the current TreeView node.
   */
  parent?: ItemLookup;
  /**
   *  The lookup details for the children of the current TreeView node.
   */
  children?: TreeItemLookup[];
}
