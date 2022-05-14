/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TreeItemLookup } from '../../treeitem-lookup.interface';

/**
 * Arguments for the TreeView [`nodeDrag`]({% slug api_treeview_treeviewcomponent %}#toc-nodedrag) and
 * [`nodeDragEnd`]({% slug api_treeview_treeviewcomponent %}#toc-nodedragend) events.
 */
export class TreeItemDragEvent {
  sourceItem: TreeItemLookup;
  destinationItem: TreeItemLookup;
  originalEvent: PointerEvent;
}
