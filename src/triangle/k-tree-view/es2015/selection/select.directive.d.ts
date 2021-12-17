/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { TreeViewComponent } from '../treeview.component';
import { SelectableSettings } from './selectable-settings';
import { Subscription } from 'rxjs';
import { TreeItem } from '../treeitem.interface';
/**
 * A directive which manages the in-memory selection state of the TreeView node
 * ([see example]({% slug selection_treeview %})).
 */
export declare class SelectDirective implements OnDestroy, OnChanges {
    protected treeView: TreeViewComponent;
    /**
     * @hidden
     */
    isSelected: (item: object, index: string) => boolean;
    /**
     * Defines the item key that will be stored in the `selectedKeys` collection.
     */
    selectKey: string | ((context: TreeItem) => any);
    /**
     * Defines the current selection mode
     * ([see example]({% slug selection_treeview %}#toc-selection-modes)).
     */
    selection: boolean | SelectableSettings | string;
    /**
     * Defines the collection that will store the selected keys
     * ([see example]({% slug selection_treeview %}#toc-selection-modes)).
     */
    selectedKeys: any[];
    /**
     * Fires when the `selectedKeys` collection was updated.
     */
    selectedKeysChange: EventEmitter<any[]>;
    readonly getAriaMultiselectable: boolean;
    protected subscriptions: Subscription;
    private readonly options;
    private selectActions;
    /**
     * Reflectes the internal `selectedKeys` state.
     */
    private state;
    /**
     * Holds the last emitted `selectedKeys` collection.
     */
    private lastChange;
    constructor(treeView: TreeViewComponent);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    protected itemKey(e: any): any;
    protected select(e: any): void;
    protected selectSingle(node: any): void;
    protected selectMultiple(node: any): void;
    private notify;
}
