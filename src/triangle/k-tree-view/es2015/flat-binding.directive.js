/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { anyChanged, isChanged } from '@progress/kendo-angular-common';
import { Directive, Input } from '@angular/core';
import { getter } from '@progress/kendo-common';
import { of } from 'rxjs';
import { compose } from './funcs';
import { DataBoundComponent } from './data-bound-component';
import { isBlank, isNullOrEmptyString, isPresent, isArrayWithAtLeastOneItem } from './utils';
import { FlatEditingService } from "./drag-and-drop/editing-services/flat-editing.service";
import { IndexBuilderService } from './index-builder.service';
import { FilteringBase } from './filtering-base';
const findChildren = (prop, nodes, value) => nodes.filter((x) => prop(x) === value);
const ɵ0 = findChildren;
const indexBuilder = new IndexBuilderService();
const mapToTree = (currentLevelNodes, allNodes, parentIdField, idField, parent = null, parentIndex = '') => {
    if (!isArrayWithAtLeastOneItem(currentLevelNodes)) {
        return [];
    }
    return currentLevelNodes.map((node, idx) => {
        const index = indexBuilder.nodeIndex(idx.toString(), parentIndex);
        const wrapper = {
            dataItem: node,
            index,
            parent,
            visible: true
        };
        wrapper.children = mapToTree(findChildren(getter(parentIdField), allNodes || [], getter(idField)(node)), allNodes, parentIdField, idField, wrapper, index);
        return wrapper;
    });
};
const ɵ1 = mapToTree;
/**
 * A directive which encapsulates the retrieval of the child nodes.
 */
let FlatDataBindingDirective = class FlatDataBindingDirective extends FilteringBase {
    constructor(component) {
        super(component);
        this.component = component;
        /**
         * @hidden
         */
        this.loadOnDemand = true;
        /**
         * @hidden
         */
        this.originalData = [];
        this.component.isVisible = (node) => this.visibleNodes.has(node);
    }
    /**
     * The nodes which will be displayed by the TreeView.
     */
    set nodes(values) {
        this.originalData = values || [];
        if (!isNullOrEmptyString(this.parentIdField)) {
            const prop = getter(this.parentIdField);
            this.component.nodes = this.originalData.filter(compose(isBlank, prop));
            this.filterData = mapToTree(this.component.nodes, this.originalData, this.parentIdField, this.idField);
            this.updateVisibleNodes(this.filterData);
        }
        else {
            this.component.nodes = this.originalData.slice(0);
        }
    }
    /**
     * @hidden
     * A callback which determines whether a TreeView node should be rendered as hidden.
     */
    set isVisible(fn) {
        this.component.isVisible = fn;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        if (isPresent(this.parentIdField) && isPresent(this.idField)) {
            const fetchChildren = (node) => findChildren(getter(this.parentIdField), this.originalData || [], getter(this.idField)(node));
            this.component.hasChildren = (node) => fetchChildren(node).length > 0;
            this.component.children = (node) => of(fetchChildren(node));
            this.component.editService = new FlatEditingService(this);
            this.component.filterChange.subscribe(this.handleFilterChange.bind(this));
            if (this.component.filter) {
                this.handleFilterChange(this.component.filter);
            }
            if (!this.loadOnDemand && isPresent(this.component.preloadChildNodes)) {
                this.component.preloadChildNodes();
            }
        }
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        if (isChanged('parentIdField', changes, false)) {
            this.nodes = this.originalData;
        }
        // should react to changes.loadOnDemand as well - should preload the data or clear the already cached items
        if (anyChanged(['nodes', 'loadOnDemand'], changes) && !this.loadOnDemand && isPresent(this.component.preloadChildNodes)) {
            this.component.preloadChildNodes();
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array),
    tslib_1.__metadata("design:paramtypes", [Array])
], FlatDataBindingDirective.prototype, "nodes", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], FlatDataBindingDirective.prototype, "parentIdField", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], FlatDataBindingDirective.prototype, "idField", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], FlatDataBindingDirective.prototype, "loadOnDemand", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], FlatDataBindingDirective.prototype, "isVisible", null);
FlatDataBindingDirective = tslib_1.__decorate([
    Directive({ selector: "[kendoTreeViewFlatDataBinding]" }),
    tslib_1.__metadata("design:paramtypes", [DataBoundComponent])
], FlatDataBindingDirective);
export { FlatDataBindingDirective };
export { ɵ0, ɵ1 };
