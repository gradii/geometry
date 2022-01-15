/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { LocalizationService } from '@progress/kendo-angular-l10n';
import { Subject } from 'rxjs';
import { NavigationItem } from './navigation-item.interface';
import { NavigationModel } from './navigation-model';
import { NavigationState } from './navigation-state.interface';
/**
 * @hidden
 */
export declare class NavigationService {
    private localization;
    readonly expands: Subject<NavigationState>;
    readonly moves: Subject<NavigationState>;
    readonly checks: Subject<string>;
    readonly selects: Subject<string>;
    readonly loadMore: Subject<string>;
    navigable: boolean;
    model: NavigationModel;
    actions: {
        [x: string]: Function;
    };
    private activeItem;
    private isFocused;
    private _model;
    private readonly activeIndex;
    private readonly isActiveExpanded;
    private readonly isLoadMoreButton;
    readonly focusableItem: NavigationItem;
    constructor(localization: LocalizationService);
    activate(item: NavigationItem): void;
    activateParent(index: string): void;
    activateIndex(index: string): void;
    activateClosest(index: string): void;
    activateFocusable(): void;
    deactivate(): void;
    checkIndex(index: string): void;
    selectIndex(index: string): void;
    notifyLoadMore(index: string): void;
    isActive(index: string): boolean;
    isFocusable(index: string): boolean;
    isDisabled(index: string): boolean;
    registerItem(id: number, index: string, disabled: boolean, loadMoreButton?: boolean, visible?: boolean): void;
    unregisterItem(id: number, index: string): void;
    move(e: any): void;
    private expand;
    private moveToParent;
    private moveToFirstVisibleChild;
    private notifyExpand;
    private notifyMove;
    private navigationState;
    private handleEnter;
    private handleSpace;
}
