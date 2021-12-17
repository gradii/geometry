/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { ElementRef, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { NavigationService } from './navigation/navigation.service';
import { SelectionService } from './selection/selection.service';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { TreeItem } from './treeitem.interface';
import { CheckedState } from './checkbox/checked-state';
/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
export declare class TreeViewItemDirective implements OnInit, OnChanges, OnDestroy {
    private element;
    private expandService;
    private navigationService;
    private selectionService;
    private lookupService;
    private renderer;
    private ib;
    dataItem: any;
    index: string;
    parentDataItem: any;
    parentIndex: string;
    role: string;
    loadOnDemand: boolean;
    checkable: boolean;
    selectable: boolean;
    expandable: boolean;
    isChecked: CheckedState;
    isDisabled: boolean;
    isVisible: boolean;
    isExpanded: boolean;
    isSelected: boolean;
    readonly isButton: boolean;
    readonly treeItem: TreeItem;
    readonly parentTreeItem: TreeItem;
    ariaChecked: string;
    readonly id: number;
    private _isExpanded;
    private _isSelected;
    private isInitialized;
    private subscriptions;
    constructor(element: ElementRef, expandService: ExpandStateService, navigationService: NavigationService, selectionService: SelectionService, lookupService: TreeViewLookupService, renderer: Renderer2, ib: IndexBuilderService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    subscribe(): void;
    private registerNavigationItem;
    private activateItem;
    private expand;
    private isFocusable;
    private focusItem;
    private moveLookupItem;
    private moveNavigationItem;
    private updateNodeAvailability;
    private setAriaAttributes;
    private setDisabledClass;
    private setClass;
    private updateTabIndex;
    private setAttribute;
}
