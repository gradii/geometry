/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { TreeItemFilterState } from "./drag-and-drop/models/tree-item-filter-state";
import { TreeViewFilterSettings } from "./treeview-filter-settings";
/**
 * Information about the current filter state of each node in the component.
 * Emitted by the [`filterStateChange`]({% slug api_treeview_treeviewcomponent %}#toc-filterstatechange)
 */
export interface FilterState {
    /**
     * The list of TreeView node wrappers which contain metadata about the current filtered state of the component.
     * Useful for custom implementations of auto-expanding nodes triggered by filtering.
     */
    nodes: TreeItemFilterState[];
    /**
     * The number of nodes which match the current filter term.
     */
    matchCount: number;
    /**
     * The current filter term of the TreeView.
     */
    term: string;
    /**
     * The settings according to which the current filter was performed.
     */
    filterSettings: TreeViewFilterSettings;
}
