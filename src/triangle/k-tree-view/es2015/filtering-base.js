/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Input } from "@angular/core";
import { DEFAULT_FILTER_SETTINGS } from "./treeview-filter-settings";
import { filterTree, isPresent } from "./utils";
/**
 * @hidden
 */
export class FilteringBase {
    constructor(component) {
        this.component = component;
        this.visibleNodes = new Set();
        this._filterSettings = DEFAULT_FILTER_SETTINGS;
    }
    /**
     * The settings which are applied when performing a filter on the component's data.
     */
    set filterSettings(settings) {
        this._filterSettings = Object.assign({}, DEFAULT_FILTER_SETTINGS, settings);
    }
    get filterSettings() {
        return this._filterSettings;
    }
    /**
     * Applies a filter and changes the visibility of the component's nodes accordingly.
     */
    set filter(term) {
        this.handleFilterChange(term);
    }
    /**
     * @hidden
     */
    handleFilterChange(term) {
        if (!this.filterData) {
            return;
        }
        this.resetNodesVisibility(this.filterData);
        if (term) {
            filterTree(this.filterData, term, this.filterSettings, this.component.textField);
        }
        this.updateVisibleNodes(this.filterData);
        if (isPresent(this.component.filterStateChange)) {
            this.component.filterStateChange.emit({
                nodes: this.filterData,
                matchCount: this.visibleNodes.size,
                term,
                filterSettings: this.filterSettings
            });
        }
    }
    updateVisibleNodes(items) {
        items.forEach((wrapper) => {
            if (wrapper.visible) {
                this.visibleNodes.add(wrapper.dataItem);
            }
            if (wrapper.children) {
                this.updateVisibleNodes(wrapper.children);
            }
        });
    }
    resetNodesVisibility(items) {
        this.visibleNodes.clear();
        items.forEach((wrapper) => {
            wrapper.visible = true;
            if (wrapper.children) {
                this.resetNodesVisibility(wrapper.children);
            }
        });
    }
}
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], FilteringBase.prototype, "filterSettings", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], FilteringBase.prototype, "filter", null);
