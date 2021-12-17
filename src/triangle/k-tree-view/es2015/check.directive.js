/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, EventEmitter, Input, Output, NgZone } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
import { fetchLoadedDescendants, isBoolean, isPresent, noop } from './utils';
import { Subscription } from 'rxjs';
import { filter, take, switchMap, tap } from 'rxjs/operators';
import { isChanged } from '@progress/kendo-angular-common';
const indexChecked = (keys, index) => keys.filter(k => k === index).length > 0;
const ɵ0 = indexChecked;
const matchKey = index => k => {
    if (index === k) {
        return true;
    }
    if (!k.split) {
        return false;
    }
    return k.split('_').reduce(({ key, result }, part) => {
        key += part;
        if (index === key || result) {
            return { result: true };
        }
        key += "_";
        return { key, result: false };
    }, { key: "", result: false }).result;
};
const ɵ1 = matchKey;
/**
 * A directive which manages the in-memory checked state of the TreeView node
 * ([see example]({% slug checkboxes_treeview %})).
 */
let CheckDirective = class CheckDirective {
    constructor(treeView, zone) {
        this.treeView = treeView;
        this.zone = zone;
        /**
         * Fires when the `checkedKeys` collection was updated.
         */
        this.checkedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription();
        this.checkActions = {
            'multiple': (e) => this.checkMultiple(e),
            'single': (e) => this.checkSingle(e)
        };
        /**
         * Reflectes the internal `checkedKeys` state.
         */
        this.state = new Set();
        this.subscriptions.add(this.treeView.checkedChange
            .subscribe((e) => this.check(e)));
        let expandedItems = [];
        this.subscriptions.add(this.treeView.childrenLoaded
            .pipe(filter(() => this.options.checkChildren && this.treeView.loadOnDemand), tap(item => expandedItems.push(item)), switchMap(() => this.zone.onStable.pipe(take(1))))
            .subscribe(() => this.addCheckedItemsChildren(expandedItems)));
        this.treeView.isChecked = this.isItemChecked.bind(this);
    }
    /**
     * @hidden
     */
    set isChecked(value) {
        this.treeView.isChecked = value;
    }
    get options() {
        const defaultOptions = {
            checkChildren: true,
            checkParents: true,
            enabled: true,
            mode: "multiple"
        };
        if (!isPresent(this.checkable) || typeof this.checkable === 'string') {
            return defaultOptions;
        }
        const checkSettings = isBoolean(this.checkable)
            ? { enabled: this.checkable }
            : this.checkable;
        return Object.assign(defaultOptions, checkSettings);
    }
    ngOnChanges(changes) {
        if (changes.checkable) {
            this.treeView.checkboxes = this.options.enabled;
            this.toggleCheckOnClick();
        }
        if (isChanged('checkedKeys', changes, false) && changes.checkedKeys.currentValue !== this.lastChange) {
            this.state = new Set(changes.checkedKeys.currentValue);
        }
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.unsubscribeClick();
    }
    isItemChecked(dataItem, index) {
        if (!this.checkKey) {
            return this.isIndexChecked(index);
        }
        const hasKey = this.state.has(this.itemKey({ dataItem, index }));
        return hasKey ? 'checked' : 'none';
    }
    isIndexChecked(index) {
        const checkedKeys = Array.from(this.state).filter(matchKey(index));
        if (indexChecked(checkedKeys, index)) {
            return 'checked';
        }
        const { mode, checkParents } = this.options;
        if (mode === 'multiple' && checkParents && checkedKeys.length) {
            return 'indeterminate';
        }
        return 'none';
    }
    itemKey(item) {
        if (!isPresent(this.checkKey)) {
            return item.index;
        }
        if (typeof this.checkKey === "string" && isPresent(item.dataItem)) {
            return item.dataItem[this.checkKey];
        }
        if (typeof this.checkKey === "function") {
            return this.checkKey(item);
        }
    }
    check(e) {
        const { enabled, mode } = this.options;
        const performSelection = this.checkActions[mode] || noop;
        if (!enabled) {
            return;
        }
        performSelection(e);
    }
    checkSingle(node) {
        const key = this.itemKey(node.item);
        const hasKey = this.state.has(key);
        this.state.clear();
        if (!hasKey) {
            this.state.add(key);
        }
        this.notify();
    }
    checkMultiple(node) {
        this.checkNode(node);
        if (this.options.checkParents) {
            this.checkParents(node.parent);
        }
        this.notify();
    }
    toggleCheckOnClick() {
        this.unsubscribeClick();
        if (this.options.checkOnClick) {
            this.clickSubscription = this.treeView.nodeClick.subscribe(args => {
                if (args.type === 'click') {
                    const lookup = this.treeView.itemLookup(args.item.index);
                    this.check(lookup);
                }
            });
        }
    }
    unsubscribeClick() {
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
            this.clickSubscription = null;
        }
    }
    checkNode(node) {
        if (!isPresent(node.item.dataItem) || this.treeView.isDisabled(node.item.dataItem, node.item.index)) {
            return;
        }
        const currentKey = this.itemKey(node.item);
        if (!isPresent(currentKey)) {
            return;
        }
        const pendingCheck = [currentKey];
        if (this.options.checkChildren) {
            const descendants = fetchLoadedDescendants(node, ({ item }) => this.treeView.isVisible(item.dataItem, item.index) &&
                !this.treeView.isDisabled(item.dataItem, item.index))
                .map(({ item }) => this.itemKey(item));
            pendingCheck.push(...descendants);
        }
        const shouldCheck = !this.state.has(currentKey);
        pendingCheck.forEach(key => {
            if (shouldCheck) {
                this.state.add(key);
            }
            else {
                this.state.delete(key);
            }
        });
    }
    checkParents(parent) {
        if (!isPresent(parent)) {
            return;
        }
        let currentParent = parent;
        while (currentParent) {
            const parentKey = this.itemKey(currentParent.item);
            const allChildrenSelected = currentParent.children.every(item => this.state.has(this.itemKey(item)));
            if (allChildrenSelected) {
                this.state.add(parentKey);
            }
            else {
                this.state.delete(parentKey);
            }
            currentParent = currentParent.parent;
        }
    }
    notify() {
        this.lastChange = Array.from(this.state);
        this.checkedKeysChange.emit(this.lastChange);
    }
    addCheckedItemsChildren(lookups) {
        if (!isPresent(lookups) || lookups.length === 0) {
            return;
        }
        const initiallyCheckedItemsCount = this.state.size;
        lookups.forEach(lookup => {
            const itemKey = this.itemKey(lookup.item);
            if (!this.state.has(itemKey)) {
                return;
            }
            lookup.children.forEach(item => {
                // ensure both the parent item and each child node is enabled
                if (!this.treeView.isDisabled(lookup.item.dataItem, lookup.item.index) &&
                    !this.treeView.isDisabled(item.dataItem, item.index)) {
                    this.state.add(this.itemKey(item));
                }
            });
        });
        const hasNewlyCheckedItems = initiallyCheckedItemsCount !== this.state.size;
        if (hasNewlyCheckedItems) {
            this.zone.run(() => this.notify());
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], CheckDirective.prototype, "isChecked", null);
tslib_1.__decorate([
    Input("checkBy"),
    tslib_1.__metadata("design:type", Object)
], CheckDirective.prototype, "checkKey", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], CheckDirective.prototype, "checkedKeys", void 0);
tslib_1.__decorate([
    Input('kendoTreeViewCheckable'),
    tslib_1.__metadata("design:type", Object)
], CheckDirective.prototype, "checkable", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], CheckDirective.prototype, "checkedKeysChange", void 0);
CheckDirective = tslib_1.__decorate([
    Directive({ selector: '[kendoTreeViewCheckable]' }),
    tslib_1.__metadata("design:paramtypes", [TreeViewComponent,
        NgZone])
], CheckDirective);
export { CheckDirective };
export { ɵ0, ɵ1 };
