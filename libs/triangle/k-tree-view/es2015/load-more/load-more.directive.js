/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, Input, isDevMode } from '@angular/core';
import { guid } from '@progress/kendo-angular-common';
import { TreeViewComponent } from '../treeview.component';
import { isPresent } from '../utils';
const LOAD_MORE_DOC_LINK = 'http://www.telerik.com/kendo-angular-ui/components/treeview/load-more-button/';
/**
 * A directive that enables the display of only a limited amount of nodes per level
 * ([see example]({% slug loadmorebutton_treeview %})).
 */
let LoadMoreDirective = class LoadMoreDirective {
    constructor(treeview) {
        this.treeview = treeview;
        /**
         * Keeps track of the current page size of each node over expand/collapse cycles.
         */
        this.pageSizes = new Map();
        /**
         * Used as an identifier for the root page size as the root collection of nodes is not associated with a data item.
         */
        this.rootLevelId = guid();
        this.treeview.loadMoreService = {
            getInitialPageSize: this.getInitalPageSize.bind(this),
            getGroupSize: this.getGroupSize.bind(this),
            setGroupSize: this.setGroupSize.bind(this),
            getTotalNodesCount: this.getTotalNodesCount.bind(this)
        };
    }
    /**
     * Specifies the callback that will be called when the load more button is clicked.
     * Providing a function is only required when additional nodes are fetched on demand
     * ([see example]({% slug loadmorebutton_treeview %}#toc-remote-data)).
     */
    set loadMoreNodes(loadMoreNodes) {
        if (typeof loadMoreNodes === 'string') {
            return;
        }
        this.treeview.loadMoreService.loadMoreNodes = loadMoreNodes;
    }
    ngOnChanges() {
        this.verifySettings();
    }
    verifySettings() {
        if (!isDevMode()) {
            return;
        }
        if (!isPresent(this.pageSize)) {
            throw new Error(`To use the TreeView \`kendoTreeViewLoadMore\` directive, you need to assign a \`pageSize\` value. See ${LOAD_MORE_DOC_LINK}.`);
        }
        const loadMoreNodes = this.treeview.loadMoreService.loadMoreNodes;
        if (isPresent(loadMoreNodes) && typeof loadMoreNodes !== 'function') {
            throw new Error(`The passed value to the \`kendoTreeViewLoadMore\` directive must be a function that retrieves additional nodes. See ${LOAD_MORE_DOC_LINK}.`);
        }
        if (isPresent(loadMoreNodes) && !isPresent(this.totalField)) {
            throw new Error(`When a function to fetch additional nodes is provided to the \`kendoTreeViewLoadMore\` directive, the \`totalField\` and \`totalRootNodes\` values must also be provided. See ${LOAD_MORE_DOC_LINK}.`);
        }
    }
    getGroupSize(dataItem) {
        const itemKey = dataItem || this.rootLevelId;
        return this.pageSizes.has(itemKey) ? this.pageSizes.get(itemKey) : this.pageSize;
    }
    setGroupSize(dataItem, pageSize) {
        const itemKey = dataItem || this.rootLevelId;
        const normalizedSizeValue = pageSize > 0 ? pageSize : 0;
        this.pageSizes.set(itemKey, normalizedSizeValue);
    }
    getTotalNodesCount(dataItem, loadedNodesCount) {
        if (isPresent(dataItem) && isPresent(this.totalField)) {
            return dataItem[this.totalField];
        }
        else if (!isPresent(dataItem) && isPresent(this.totalRootNodes)) {
            return this.totalRootNodes;
        }
        else {
            return loadedNodesCount;
        }
    }
    getInitalPageSize() {
        return this.pageSize;
    }
};
tslib_1.__decorate([
    Input('kendoTreeViewLoadMore'),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], LoadMoreDirective.prototype, "loadMoreNodes", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], LoadMoreDirective.prototype, "pageSize", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], LoadMoreDirective.prototype, "totalRootNodes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], LoadMoreDirective.prototype, "totalField", void 0);
LoadMoreDirective = tslib_1.__decorate([
    Directive({
        selector: '[kendoTreeViewLoadMore]'
    }),
    tslib_1.__metadata("design:paramtypes", [TreeViewComponent])
], LoadMoreDirective);
export { LoadMoreDirective };
