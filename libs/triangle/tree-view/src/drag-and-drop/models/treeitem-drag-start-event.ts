/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TreeItemLookup } from '../../treeitem-lookup.interface';
import { PreventableEvent } from './preventable-event';

/**
 * Arguments for the TreeView [`nodeDragStart`]({% slug api_treeview_treeviewcomponent %}#toc-nodedragstart) event.
 */
export class TreeItemDragStartEvent extends PreventableEvent {
  sourceItem: TreeItemLookup;
  originalEvent: PointerEvent;

  /**
   * @hidden
   */
  constructor(initializer: {
    sourceItem: TreeItemLookup;
    originalEvent: PointerEvent;
  }) {
    super();
    Object.assign(this, initializer);
  }
}
