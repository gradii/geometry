/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { EventEmitter, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { ExpandableComponent } from './expandable-component';
import { Subscription } from 'rxjs';
import { TreeItem } from './treeitem.interface';
import { FilterExpandSettings } from './filter-expand-settings.interface';
/**
 * @hidden
 */
interface ExpandTreeItem extends TreeItem {
    expand: boolean;
}
/**
 * A directive which manages the expanded state of the TreeView.
 * ([see example]({% slug expandedstate_treeview %})).
 */
export declare class ExpandDirective implements OnDestroy, OnChanges {
    protected component: ExpandableComponent;
    /**
     * @hidden
     */
    isExpanded: (item: object, index: string) => boolean;
    /**
     * Defines the item key that will be stored in the `expandedKeys` collection.
     */
    expandKey: string | ((context: TreeItem) => any);
    /**
     * Whether or not to auto-expand the nodes leading from the root node to each filter result.
     * To fine-tune this behavior, pass a [`FilterExpandSettings`]({% slug api_treeview_filterexpandsettings %}) object to this input.
     * @default false
     */
    expandOnFilter: boolean | FilterExpandSettings;
    readonly filterExpandSettings: FilterExpandSettings;
    /**
     * Fires when the `expandedKeys` collection was updated.
     */
    expandedKeysChange: EventEmitter<any[]>;
    /**
     * Defines the collection that will store the expanded keys.
     */
    expandedKeys: any[];
    protected subscriptions: Subscription;
    /**
     * Reflectes the internal `expandedKeys` state.
     */
    private state;
    private originalExpandedKeys;
    private isFiltered;
    /**
     * Holds the last emitted `expandedKeys` collection.
     */
    private lastChange;
    constructor(component: ExpandableComponent);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    itemKey(e: TreeItem): string;
    protected toggleExpand({ index, dataItem, expand }: ExpandTreeItem): void;
    private handleAutoExpand;
    /**
     * Fills array with the correct expand keys according to wrapper metadata.
     */
    private updateExpandedNodes;
    /**
     * Fills array with the expand key of every node.
     */
    private getEveryExpandKey;
    private notify;
}
export {};
