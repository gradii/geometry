/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, Input, Optional, Host } from '@angular/core';
import { getter } from '@progress/kendo-common';
import { anyChanged, isChanged } from '@progress/kendo-angular-common';
import { DataBoundComponent } from './data-bound-component';
import { isArrayWithAtLeastOneItem, isPresent } from './utils';
import { of } from 'rxjs';
import { HierarchyEditingService } from './drag-and-drop/editing-services/hierarchy-editing.service';
import { DragAndDropDirective } from './drag-and-drop/drag-and-drop.directive';
import { isVisible } from './default-callbacks';
import { IndexBuilderService } from './index-builder.service';
import { FilteringBase } from './filtering-base';
const indexBuilder = new IndexBuilderService();
const mapToWrappers = (currentLevelNodes, childrenField, parent = null, parentIndex = '') => {
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
        wrapper.children = mapToWrappers(getter(childrenField)(node), childrenField, wrapper, index);
        return wrapper;
    });
};
const ɵ0 = mapToWrappers;
/**
 * A directive which encapsulates the retrieval of child nodes.
 */
let HierarchyBindingDirective = class HierarchyBindingDirective extends FilteringBase {
    constructor(component, dragAndDropDirective) {
        super(component);
        this.component = component;
        this.dragAndDropDirective = dragAndDropDirective;
        /**
         * @hidden
         */
        this.loadOnDemand = true;
        this.originalData = [];
        const shouldFilter = !isPresent(this.dragAndDropDirective);
        this.component.isVisible = shouldFilter ? (node) => this.visibleNodes.has(node) : isVisible;
    }
    /**
     * The field name which holds the data items of the child component.
     */
    set childrenField(value) {
        if (!value) {
            throw new Error("'childrenField' cannot be empty");
        }
        this._childrenField = value;
    }
    /**
     * The nodes which will be displayed by the TreeView.
     */
    set nodes(values) {
        this.originalData = values || [];
        this.filterData = mapToWrappers(values, this.childrenField) || [];
        this.updateVisibleNodes(this.filterData);
    }
    /**
     * @hidden
     * A callback which determines whether a TreeView node should be rendered as hidden.
     */
    set isVisible(fn) {
        this.component.isVisible = fn;
    }
    /**
     * The field name which holds the data items of the child component.
     */
    get childrenField() {
        return this._childrenField;
    }
    ngOnInit() {
        if (isPresent(this.childrenField)) {
            this.component.children = item => of(getter(this.childrenField)(item));
            this.component.hasChildren = item => {
                const children = getter(this.childrenField)(item);
                return Boolean(children && children.length);
            };
            this.component.editService = new HierarchyEditingService(this);
            this.component.filterChange.subscribe(this.handleFilterChange.bind(this));
            if (this.component.filter) {
                this.handleFilterChange(this.component.filter);
            }
            if (!this.loadOnDemand && isPresent(this.component.preloadChildNodes)) {
                this.component.preloadChildNodes();
            }
        }
    }
    ngOnChanges(changes) {
        if (isChanged('childrenField', changes, false)) {
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
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], HierarchyBindingDirective.prototype, "childrenField", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array),
    tslib_1.__metadata("design:paramtypes", [Array])
], HierarchyBindingDirective.prototype, "nodes", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], HierarchyBindingDirective.prototype, "isVisible", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], HierarchyBindingDirective.prototype, "loadOnDemand", void 0);
HierarchyBindingDirective = tslib_1.__decorate([
    Directive({ selector: '[kendoTreeViewHierarchyBinding]' }),
    tslib_1.__param(1, Optional()), tslib_1.__param(1, Host()),
    tslib_1.__metadata("design:paramtypes", [DataBoundComponent,
        DragAndDropDirective])
], HierarchyBindingDirective);
export { HierarchyBindingDirective };
export { ɵ0 };
