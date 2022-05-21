/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TreeItemAddRemoveArgs } from './treeitem-add-remove-args';

/**
 * Specifies the handlers called on drag-and-drop [`addItem`]({% slug api_treeview_treeviewcomponent %}#toc-additem)
 * and [`removeItem`]({% slug api_treeview_treeviewcomponent %}#toc-removeitem) events.
 */
export interface EditService {
  /**
   * The event handler called when the drag-and-drop
   * [`addItem`]({% slug api_treeview_treeviewcomponent %}#toc-additem) event is fired.
   */
  add: (args: TreeItemAddRemoveArgs) => void;
  /**
   * The event handler called when the drag-and-drop
   * [`removeItem`]({% slug api_treeview_treeviewcomponent %}#toc-removeitem) event is fired.
   */
  remove: (args: TreeItemAddRemoveArgs) => void;
}

