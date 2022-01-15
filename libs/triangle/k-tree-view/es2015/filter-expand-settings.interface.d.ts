/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
export interface FilterExpandSettings {
    /**
     * The max amount of auto-expanded filter results.
     * If the number of filter results exceeds this value, the expanded state will be reverted according to the [expandedOnClear]({% slug api_treeview_filterexpandsettings %}#toc-expandedonclear) setting.
     * The default special value of -1 allows any number of results to be auto-expanded.
     * @default -1
     */
    maxAutoExpandResults?: number;
    /**
     * Expand the matching nodes in order to display their children too.
     * Only applicable in lenient mode because in strict mode, non-matching children are filtered out.
     * @default false
     */
    expandMatches?: boolean;
    /**
     * Sets which nodes should be expanded when the filter is cleared.
     *
     * * "none"&mdash;Collapse all nodes.
     * * "all"&mdash;Expand all nodes.
     * * "initial"&mdash;Restore the set of initially expanded nodes from before the filtering.
     * * "unchanged"&mdash;Leave the expanded state of each node as-is.
     *
     * @default "none"
     */
    expandedOnClear?: "all" | "none" | "initial" | "unchanged";
    /**
     * @hidden
     */
    enabled?: boolean;
}
