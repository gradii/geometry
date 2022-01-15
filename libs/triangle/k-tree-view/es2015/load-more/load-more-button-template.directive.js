/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Optional, Directive, TemplateRef } from "@angular/core";
/**
 * Represents the template for the TreeView load more buttons.
 * To define a button template, nest an `<ng-template>`
 * tag with the `kendoTreeViewLoadMoreButtonTemplate` directive inside a `<kendo-treeview>` tag
 * ([see example]({% slug loadmorebutton_treeview %}#toc-button-template)).
 *
 * The hierarchical index of the load more button node is available as a context variable:
 *
 * - `let-index="index"` (`string`)
 */
let LoadMoreButtonTemplateDirective = class LoadMoreButtonTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
};
LoadMoreButtonTemplateDirective = tslib_1.__decorate([
    Directive({
        selector: '[kendoTreeViewLoadMoreButtonTemplate]'
    }),
    tslib_1.__param(0, Optional()),
    tslib_1.__metadata("design:paramtypes", [TemplateRef])
], LoadMoreButtonTemplateDirective);
export { LoadMoreButtonTemplateDirective };
