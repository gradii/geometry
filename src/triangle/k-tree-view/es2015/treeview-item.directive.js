/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { anyChanged } from '@progress/kendo-angular-common';
import { NavigationService } from './navigation/navigation.service';
import { SelectionService } from './selection/selection.service';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { isPresent } from './utils';
import { filter } from 'rxjs/operators';
const buildItem = (index, dataItem) => ({ dataItem, index });
const ɵ0 = buildItem;
let id = 0;
const TREE_ITEM_ROLE = 'treeitem';
const BUTTON_ROLE = 'button';
/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
let TreeViewItemDirective = class TreeViewItemDirective {
    constructor(element, expandService, navigationService, selectionService, lookupService, renderer, ib) {
        this.element = element;
        this.expandService = expandService;
        this.navigationService = navigationService;
        this.selectionService = selectionService;
        this.lookupService = lookupService;
        this.renderer = renderer;
        this.ib = ib;
        this.role = TREE_ITEM_ROLE;
        this.loadOnDemand = true;
        this.isDisabled = false;
        this.isVisible = true;
        this.ariaChecked = 'false';
        this.id = id++;
        this.isInitialized = false;
        this.subscriptions = [];
        this.subscribe();
    }
    set isChecked(checked) {
        if (checked === 'checked') {
            this.ariaChecked = 'true';
        }
        else if (checked === 'indeterminate') {
            this.ariaChecked = 'mixed';
        }
        else {
            this.ariaChecked = 'false';
        }
    }
    get isExpanded() {
        return this._isExpanded || false;
    }
    set isExpanded(isExpanded) {
        this._isExpanded = isExpanded;
    }
    get isSelected() {
        return this._isSelected || false;
    }
    set isSelected(isSelected) {
        this._isSelected = isSelected;
    }
    get isButton() {
        return this.role === BUTTON_ROLE;
    }
    get treeItem() {
        return buildItem(this.index, this.dataItem);
    }
    get parentTreeItem() {
        return this.parentDataItem ? buildItem(this.parentIndex, this.parentDataItem) : null;
    }
    ngOnInit() {
        if (this.loadOnDemand && !this.isButton) {
            this.lookupService.registerItem(this.treeItem, this.parentTreeItem);
        }
        this.registerNavigationItem();
        this.isInitialized = true;
        this.setAttribute('role', this.role);
        this.setAriaAttributes();
        this.setDisabledClass();
        this.updateTabIndex();
    }
    ngOnChanges(changes) {
        const { index, isDisabled } = changes;
        if (anyChanged(['index', 'checkable', 'isChecked', 'expandable', 'isExpanded', 'selectable', 'isSelected'], changes)) {
            this.setAriaAttributes();
        }
        if (isDisabled) {
            this.setDisabledClass();
        }
        if (this.loadOnDemand && !this.isButton) {
            this.moveLookupItem(changes);
        }
        this.moveNavigationItem(index);
        if (anyChanged(['isDisabled', 'isVisible'], changes)) {
            this.updateNodeAvailability();
        }
    }
    ngOnDestroy() {
        this.navigationService.unregisterItem(this.id, this.index);
        if (this.loadOnDemand && !this.isButton) {
            this.lookupService.unregisterItem(this.index, this.dataItem);
        }
        this.subscriptions = this.subscriptions.reduce((list, callback) => (callback.unsubscribe(), list), []);
    }
    subscribe() {
        this.subscriptions = [
            this.navigationService.moves
                .subscribe(() => {
                this.updateTabIndex();
                this.focusItem();
            }),
            this.navigationService.expands
                .pipe(filter(({ index }) => index === this.index && !this.isDisabled))
                .subscribe(({ expand }) => this.expand(expand))
        ];
    }
    registerNavigationItem() {
        this.navigationService.registerItem(this.id, this.index, this.isDisabled, this.isButton, this.isVisible);
        this.activateItem();
    }
    activateItem() {
        if (this.isDisabled) {
            return;
        }
        const navigationService = this.navigationService;
        const selectionService = this.selectionService;
        const index = this.index;
        selectionService.setFirstSelected(index, this.isSelected);
        if (!navigationService.isActive(index) && selectionService.isFirstSelected(index)) {
            navigationService.activateIndex(index);
        }
    }
    expand(shouldExpand) {
        this.expandService[shouldExpand ? 'expand' : 'collapse'](this.index, this.dataItem);
    }
    isFocusable() {
        return !this.isDisabled && this.navigationService.isFocusable(this.index);
    }
    focusItem() {
        if (this.isInitialized && this.navigationService.isActive(this.index)) {
            this.element.nativeElement.focus();
        }
    }
    moveLookupItem(changes = {}) {
        const { dataItem, index, parentDataItem, parentIndex } = changes;
        if ((index && index.firstChange) || //skip first change
            (!dataItem && !index && !parentDataItem && !parentIndex)) {
            return;
        }
        const oldIndex = (index || {}).previousValue || this.index;
        this.lookupService.replaceItem(oldIndex, this.treeItem, this.parentTreeItem);
    }
    moveNavigationItem(indexChange = {}) {
        const { currentValue, firstChange, previousValue } = indexChange;
        if (!firstChange && isPresent(currentValue) && isPresent(previousValue)) {
            this.navigationService.unregisterItem(this.id, previousValue);
            this.navigationService.registerItem(this.id, currentValue, this.isDisabled, this.isButton);
        }
    }
    updateNodeAvailability() {
        const service = this.navigationService;
        if (this.isDisabled || !this.isVisible) {
            service.activateClosest(this.index); // activate before unregister the item
        }
        else {
            service.activateFocusable();
        }
        service.unregisterItem(this.id, this.index);
        service.registerItem(this.id, this.index, this.isDisabled, this.isButton, this.isVisible);
    }
    setAriaAttributes() {
        this.setAttribute('aria-level', this.ib.level(this.index).toString());
        // don't render attributes when the component configuration doesn't allow the specified state
        this.setAttribute('aria-expanded', this.expandable ? this.isExpanded.toString() : null);
        this.setAttribute('aria-selected', this.selectable ? this.isSelected.toString() : null);
        this.setAttribute('aria-checked', this.checkable ? this.ariaChecked : null);
    }
    setDisabledClass() {
        this.setClass('k-state-disabled', this.isDisabled);
    }
    setClass(className, toggle) {
        const action = toggle ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    }
    updateTabIndex() {
        this.setAttribute('tabIndex', this.isFocusable() ? '0' : '-1');
    }
    setAttribute(attr, value) {
        if (!isPresent(value)) {
            this.renderer.removeAttribute(this.element.nativeElement, attr);
            return;
        }
        this.renderer.setAttribute(this.element.nativeElement, attr, value);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TreeViewItemDirective.prototype, "dataItem", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TreeViewItemDirective.prototype, "index", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TreeViewItemDirective.prototype, "parentDataItem", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TreeViewItemDirective.prototype, "parentIndex", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TreeViewItemDirective.prototype, "role", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewItemDirective.prototype, "loadOnDemand", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewItemDirective.prototype, "checkable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewItemDirective.prototype, "selectable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewItemDirective.prototype, "expandable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], TreeViewItemDirective.prototype, "isChecked", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewItemDirective.prototype, "isDisabled", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewItemDirective.prototype, "isVisible", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [Boolean])
], TreeViewItemDirective.prototype, "isExpanded", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [Boolean])
], TreeViewItemDirective.prototype, "isSelected", null);
TreeViewItemDirective = tslib_1.__decorate([
    Directive({ selector: '[kendoTreeViewItem]' }),
    tslib_1.__metadata("design:paramtypes", [ElementRef,
        ExpandStateService,
        NavigationService,
        SelectionService,
        TreeViewLookupService,
        Renderer2,
        IndexBuilderService])
], TreeViewItemDirective);
export { TreeViewItemDirective };
export { ɵ0 };
