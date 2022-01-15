/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { DataBoundComponent } from "./data-bound-component";
import { TreeItemFilterState } from "./drag-and-drop/models/tree-item-filter-state";
import { TreeViewFilterSettings } from "./treeview-filter-settings";
/**
 * @hidden
 */
export declare abstract class FilteringBase {
    protected component: DataBoundComponent;
    /**
     * Stores the unfiltered nodes
     */
    protected filterData: TreeItemFilterState[];
    protected visibleNodes: Set<any>;
    /**
     * The settings which are applied when performing a filter on the component's data.
     */
    filterSettings: TreeViewFilterSettings;
    private _filterSettings;
    /**
     * Applies a filter and changes the visibility of the component's nodes accordingly.
     */
    filter: string;
    constructor(component: DataBoundComponent);
    /**
     * @hidden
     */
    handleFilterChange(term: string): void;
    protected updateVisibleNodes(items: TreeItemFilterState[]): void;
    protected resetNodesVisibility(items: TreeItemFilterState[]): void;
}
