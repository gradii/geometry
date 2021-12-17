/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ExpandableComponent } from './expandable-component';
import { Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { isArrayWithAtLeastOneItem, isBoolean, sameValues } from './utils';
import { isChanged } from '@progress/kendo-angular-common';
const DEFAULT_FILTER_EXPAND_SETTINGS = {
    maxAutoExpandResults: -1,
    expandMatches: false,
    expandedOnClear: "none"
};
/**
 * A directive which manages the expanded state of the TreeView.
 * ([see example]({% slug expandedstate_treeview %})).
 */
let ExpandDirective = class ExpandDirective {
    constructor(component) {
        this.component = component;
        /**
         * Whether or not to auto-expand the nodes leading from the root node to each filter result.
         * To fine-tune this behavior, pass a [`FilterExpandSettings`]({% slug api_treeview_filterexpandsettings %}) object to this input.
         * @default false
         */
        this.expandOnFilter = false;
        /**
         * Fires when the `expandedKeys` collection was updated.
         */
        this.expandedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription();
        /**
         * Reflectes the internal `expandedKeys` state.
         */
        this.state = new Set();
        this.originalExpandedKeys = new Set();
        this.isFiltered = false;
        /**
         * Fills array with the correct expand keys according to wrapper metadata.
         */
        this.updateExpandedNodes = (collection, node, autoExpandMatches) => {
            if (node.containsMatches || node.isMatch && autoExpandMatches && isArrayWithAtLeastOneItem(node.children)) {
                collection.push(this.itemKey({ dataItem: node.dataItem, index: node.index }));
            }
            if (isArrayWithAtLeastOneItem(node.children)) {
                node.children.forEach(child => {
                    this.updateExpandedNodes(collection, child, autoExpandMatches);
                });
            }
        };
        /**
         * Fills array with the expand key of every node.
         */
        this.getEveryExpandKey = (collection, node) => {
            if (isArrayWithAtLeastOneItem(node.children)) {
                collection.push(this.itemKey({ dataItem: node.dataItem, index: node.index }));
            }
            if (isArrayWithAtLeastOneItem(node.children)) {
                node.children.forEach(child => {
                    this.getEveryExpandKey(collection, child);
                });
            }
        };
        this.subscriptions.add(merge(this.component.expand.pipe(map(e => (Object.assign({ expand: true }, e)))), this.component.collapse.pipe(map(e => (Object.assign({ expand: false }, e))))).subscribe(this.toggleExpand.bind(this)));
        if (this.component.filterStateChange) {
            this.subscriptions.add(this.component.filterStateChange.subscribe(this.handleAutoExpand.bind(this)));
        }
        this.component.isExpanded = (dataItem, index) => this.state.has(this.itemKey({ dataItem, index }));
    }
    /**
     * @hidden
     */
    set isExpanded(value) {
        this.component.isExpanded = value;
    }
    get filterExpandSettings() {
        const settings = isBoolean(this.expandOnFilter) ? { enabled: this.expandOnFilter } : Object.assign({}, this.expandOnFilter, { enabled: true });
        return Object.assign({}, DEFAULT_FILTER_EXPAND_SETTINGS, settings);
    }
    ngOnChanges(changes) {
        if (isChanged('expandedKeys', changes, false) && changes.expandedKeys.currentValue !== this.lastChange) {
            this.state = new Set(changes.expandedKeys.currentValue);
        }
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    /**
     * @hidden
     */
    itemKey(e) {
        if (this.expandKey) {
            if (typeof this.expandKey === "string") {
                return e.dataItem[this.expandKey];
            }
            if (typeof this.expandKey === "function") {
                return this.expandKey(e);
            }
        }
        return e.index;
    }
    toggleExpand({ index, dataItem, expand }) {
        const key = this.itemKey({ index, dataItem });
        const isExpanded = this.state.has(key);
        let notify = false;
        if (isExpanded && !expand) {
            this.state.delete(key);
            notify = true;
        }
        else if (!isExpanded && expand) {
            this.state.add(key);
            notify = true;
        }
        if (notify) {
            this.notify();
        }
    }
    handleAutoExpand({ nodes, matchCount, term }) {
        if (!this.filterExpandSettings.enabled) {
            return;
        }
        const { maxAutoExpandResults, expandMatches: autoExpandMatches, expandedOnClear } = this.filterExpandSettings;
        if (!this.isFiltered) {
            this.originalExpandedKeys = new Set(this.state);
        }
        const exitingFilteredState = this.isFiltered && !term;
        const maxExceeded = maxAutoExpandResults !== -1 && matchCount > maxAutoExpandResults;
        const exitAutoExpandedState = exitingFilteredState || maxExceeded;
        if (exitAutoExpandedState) {
            switch (expandedOnClear) {
                case "initial": {
                    if (!sameValues(this.state, this.originalExpandedKeys)) {
                        this.state = this.originalExpandedKeys;
                        this.notify();
                    }
                    break;
                }
                case "all": {
                    this.state = new Set(nodes.reduce((acc, rootNode) => {
                        this.getEveryExpandKey(acc, rootNode);
                        return acc;
                    }, []));
                    this.notify();
                    break;
                }
                case "unchanged": {
                    break;
                }
                case "none":
                default: {
                    if (this.state.size !== 0) {
                        this.state.clear();
                        this.notify();
                    }
                    break;
                }
            }
            this.isFiltered = false;
            return;
        }
        const indicesToExpand = new Set(nodes.reduce((acc, rootNode) => {
            this.updateExpandedNodes(acc, rootNode, autoExpandMatches);
            return acc;
        }, []));
        if (!sameValues(this.state, indicesToExpand)) {
            this.state = indicesToExpand;
            this.notify();
        }
        this.isFiltered = true;
    }
    notify() {
        this.lastChange = Array.from(this.state);
        this.expandedKeysChange.emit(this.lastChange);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], ExpandDirective.prototype, "isExpanded", null);
tslib_1.__decorate([
    Input("expandBy"),
    tslib_1.__metadata("design:type", Object)
], ExpandDirective.prototype, "expandKey", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ExpandDirective.prototype, "expandOnFilter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ExpandDirective.prototype, "expandedKeysChange", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ExpandDirective.prototype, "expandedKeys", void 0);
ExpandDirective = tslib_1.__decorate([
    Directive({ selector: '[kendoTreeViewExpandable]' }),
    tslib_1.__metadata("design:paramtypes", [ExpandableComponent])
], ExpandDirective);
export { ExpandDirective };
