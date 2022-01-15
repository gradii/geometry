/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
/**
 * A directive which manages the disabled in-memory state of the TreeView node
 * ([see example]({% slug disabledstate_treeview %})).
 */
let DisableDirective = class DisableDirective {
    constructor(treeView, cdr) {
        this.treeView = treeView;
        this.cdr = cdr;
        /**
         * Defines the collection that will store the disabled keys.
         */
        this.disabledKeys = [];
        this.treeView.isDisabled = (dataItem, index) => (this.disabledKeys.indexOf(this.itemKey({ dataItem, index })) > -1);
    }
    /**
     * @hidden
     */
    set isDisabled(value) {
        this.treeView.isDisabled = value;
    }
    ngOnChanges(changes = {}) {
        const { disabledKeys } = changes;
        if (disabledKeys && !disabledKeys.firstChange) {
            this.cdr.markForCheck();
        }
    }
    itemKey(e) {
        if (!this.disableKey) {
            return e.index;
        }
        if (typeof this.disableKey === "string") {
            return e.dataItem[this.disableKey];
        }
        if (typeof this.disableKey === "function") {
            return this.disableKey(e);
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], DisableDirective.prototype, "isDisabled", null);
tslib_1.__decorate([
    Input("kendoTreeViewDisable"),
    tslib_1.__metadata("design:type", Object)
], DisableDirective.prototype, "disableKey", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], DisableDirective.prototype, "disabledKeys", void 0);
DisableDirective = tslib_1.__decorate([
    Directive({ selector: '[kendoTreeViewDisable]' }),
    tslib_1.__metadata("design:paramtypes", [TreeViewComponent,
        ChangeDetectorRef])
], DisableDirective);
export { DisableDirective };
