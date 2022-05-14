/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TreeViewComponent } from '../../treeview.component';
import { TreeItemLookup } from '../../treeitem-lookup.interface';
import { DropPosition } from './drop-position';

/**
 * Describes the information emitted on [`addItem`]({% slug api_treeview_treeviewcomponent %}#toc-additem)
 * and [`removeItem`]({% slug api_treeview_treeviewcomponent %}#toc-removeitem) events during drag-and-drop.
 */
export interface TreeItemAddRemoveArgs {
  /**
   * A reference of the TreeView from which the dragged item originates.
   */
  sourceTree: TreeViewComponent;
  /**
   * A reference of the TreeView onto which the dragged item is dropped.
   */
  destinationTree: TreeViewComponent;
  /**
   * The look-up info for the dragged item.
   */
  sourceItem: TreeItemLookup;
  /**
   * The look-up info for the item onto which the dragged item is dropped.
   */
  destinationItem: TreeItemLookup;
  /**
   * Describes where the dragged item is dropped relative to the drop target item.
   */
  dropPosition: DropPosition;
}

