/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, Optional, TemplateRef } from '@angular/core';
/**
 * Represents the template for the TreeView drag clue when an item is dragged. To define the clue template,
 * nest an `<ng-template>` tag with the `kendoTreeViewDragClueTemplate` directive inside a `<kendo-treeview>` tag
 * ([see example]({% slug draganddrop_treeview %}#toc-templates)).
 *
 *
 * The text, attempted drop action, source item and destination item are available as context variables in the template:
 *
 *
 * - `let-text="text"` (`string`)
 * - `let-action="action"` ([`DropAction`]({% slug api_treeview_dropaction %}))
 * - `let-sourceItem="sourceItem"` ([`TreeItemLookup`]({% slug api_treeview_treeitemlookup %}))
 * - `let-destinationItem="destinationItem"` ([`TreeItemLookup`]({% slug api_treeview_treeitemlookup %}))
 */
let DragClueTemplateDirective = class DragClueTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
};
DragClueTemplateDirective = tslib_1.__decorate([
    Directive({
        selector: '[kendoTreeViewDragClueTemplate]'
    }),
    tslib_1.__param(0, Optional()),
    tslib_1.__metadata("design:paramtypes", [TemplateRef])
], DragClueTemplateDirective);
export { DragClueTemplateDirective };
