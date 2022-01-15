/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, Optional, TemplateRef } from '@angular/core';
/**
 * Represents the template for the TreeView drop hint when an item is dragged. To define the hint template,
 * nest an `<ng-template>` tag with the `kendoTreeViewDropHintTemplate` directive inside a `<kendo-treeview>` tag
 * ([see example]({% slug draganddrop_treeview %}#toc-templates)).
 *
 * The attempted drop action, source item and destination item are available as context variables in the template:
 *
 * - `let-action="action"` ([`DropAction`]({% slug api_treeview_dropaction %}))
 * - `let-sourceItem="sourceItem"` ([`TreeItemLookup`]({% slug api_treeview_treeitemlookup %}))
 * - `let-destinationItem="destinationItem"` ([`TreeItemLookup`]({% slug api_treeview_treeitemlookup %}))
 */
let DropHintTemplateDirective = class DropHintTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
};
DropHintTemplateDirective = tslib_1.__decorate([
    Directive({
        selector: '[kendoTreeViewDropHintTemplate]'
    }),
    tslib_1.__param(0, Optional()),
    tslib_1.__metadata("design:paramtypes", [TemplateRef])
], DropHintTemplateDirective);
export { DropHintTemplateDirective };
