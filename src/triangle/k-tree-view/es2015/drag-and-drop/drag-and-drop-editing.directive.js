/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeViewComponent } from '../treeview.component';
import { isPresent } from '../utils';
/**
 * A directive which enables the update of the initially provided data array during drag-and-drop.
 *
 * Either use this directive in combination with one of the data binding directives ([`kendoTreeViewHierarchyBinding`]({% slug api_treeview_hierarchybindingdirective %})
 * or [`kendoTreeViewFlatDataBinding`]({% slug api_treeview_flatdatabindingdirective %})) which set their own edit handlers, or provide
 * your own [`editService`]({% slug api_treeview_editservice %}) to this directive. The latter subscribes to and calls the
 * [`addItem`]({% slug api_treeview_treeviewcomponent %}#toc-additem) and [`removeItem`]({% slug api_treeview_treeviewcomponent %}#toc-removeitem)
 * handlers when the corresponding events are triggered by the TreeView component.
 */
let DragAndDropEditingDirective = class DragAndDropEditingDirective {
    constructor(treeview) {
        this.treeview = treeview;
        this.subscriptions = new Subscription();
        this.subscriptions.add(this.treeview.addItem.subscribe(this.handleAdd.bind(this)));
        this.subscriptions.add(this.treeview.removeItem.subscribe(this.handleRemove.bind(this)));
    }
    /**
     * Specifies the handlers called on drag-and-drop [`addItem`]({% slug api_treeview_treeviewcomponent %}#toc-additem)
     * and [`removeItem`]({% slug api_treeview_treeviewcomponent %}#toc-removeitem) events.
     */
    set editService(service) {
        this.treeview.editService = service;
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    handleAdd(args) {
        if (!isPresent(this.treeview.editService)) {
            throw new Error('No `editService` provided. Either provide your own implementation or use this directive in combination with one of the data binding directives (`kendoTreeViewHierarchyBinding` or `kendoTreeViewFlatDataBinding`).');
        }
        this.treeview.editService.add(args);
    }
    handleRemove(args) {
        if (!isPresent(this.treeview.editService)) {
            throw new Error('No `editService` provided. Either provide your own implementation or use this directive in combination with one of the data binding directives (`kendoTreeViewHierarchyBinding` or `kendoTreeViewFlatDataBinding`).');
        }
        this.treeview.editService.remove(args);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], DragAndDropEditingDirective.prototype, "editService", null);
DragAndDropEditingDirective = tslib_1.__decorate([
    Directive({
        selector: '[kendoTreeViewDragAndDropEditing]'
    }),
    tslib_1.__metadata("design:paramtypes", [TreeViewComponent])
], DragAndDropEditingDirective);
export { DragAndDropEditingDirective };
