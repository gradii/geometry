/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { TreeViewComponent } from '../treeview.component';
import { isBoolean, isPresent, noop } from '../utils';
import { Subscription } from 'rxjs';
import { isChanged } from '@progress/kendo-angular-common';
/**
 * A directive which manages the in-memory selection state of the TreeView node
 * ([see example]({% slug selection_treeview %})).
 */
let SelectDirective = class SelectDirective {
    constructor(treeView) {
        this.treeView = treeView;
        /**
         * Fires when the `selectedKeys` collection was updated.
         */
        this.selectedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription();
        this.selectActions = {
            'multiple': (e) => this.selectMultiple(e),
            'single': (e) => this.selectSingle(e)
        };
        /**
         * Reflectes the internal `selectedKeys` state.
         */
        this.state = new Set();
        this.subscriptions.add(this.treeView.selectionChange.subscribe(this.select.bind(this)));
        this.treeView.isSelected = (dataItem, index) => (this.state.has(this.itemKey({ dataItem, index })));
    }
    /**
     * @hidden
     */
    set isSelected(value) {
        this.treeView.isSelected = value;
    }
    get getAriaMultiselectable() {
        return this.options.mode === 'multiple';
    }
    get options() {
        const defaultOptions = {
            enabled: true,
            mode: 'single'
        };
        if (!isPresent(this.selection) || typeof this.selection === 'string') {
            return defaultOptions;
        }
        const selectionSettings = isBoolean(this.selection) ? { enabled: this.selection } : this.selection;
        return Object.assign(defaultOptions, selectionSettings);
    }
    ngOnChanges(changes) {
        if (isChanged('selectedKeys', changes, false) && changes.selectedKeys.currentValue !== this.lastChange) {
            this.state = new Set(changes.selectedKeys.currentValue);
        }
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    itemKey(e) {
        if (!this.selectKey) {
            return e.index;
        }
        if (typeof this.selectKey === 'string') {
            return e.dataItem[this.selectKey];
        }
        if (typeof this.selectKey === 'function') {
            return this.selectKey(e);
        }
    }
    select(e) {
        const { enabled, mode } = this.options;
        const performSelection = this.selectActions[mode] || noop;
        if (!enabled) {
            return;
        }
        performSelection(e);
    }
    selectSingle(node) {
        const key = this.itemKey(node);
        if (!this.state.has(key)) {
            this.state.clear();
            this.state.add(key);
            this.notify();
        }
    }
    selectMultiple(node) {
        const key = this.itemKey(node);
        const isSelected = this.state.has(key);
        if (!isPresent(key)) {
            return;
        }
        if (isSelected) {
            this.state.delete(key);
        }
        else {
            this.state.add(key);
        }
        this.notify();
    }
    notify() {
        this.lastChange = Array.from(this.state);
        this.selectedKeysChange.emit(this.lastChange);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], SelectDirective.prototype, "isSelected", null);
tslib_1.__decorate([
    Input('selectBy'),
    tslib_1.__metadata("design:type", Object)
], SelectDirective.prototype, "selectKey", void 0);
tslib_1.__decorate([
    Input('kendoTreeViewSelectable'),
    tslib_1.__metadata("design:type", Object)
], SelectDirective.prototype, "selection", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], SelectDirective.prototype, "selectedKeys", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], SelectDirective.prototype, "selectedKeysChange", void 0);
tslib_1.__decorate([
    HostBinding('attr.aria-multiselectable'),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [])
], SelectDirective.prototype, "getAriaMultiselectable", null);
SelectDirective = tslib_1.__decorate([
    Directive({ selector: '[kendoTreeViewSelectable]' }),
    tslib_1.__metadata("design:paramtypes", [TreeViewComponent])
], SelectDirective);
export { SelectDirective };
