/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Optional, Directive, TemplateRef } from "@angular/core";
/**
 * Represents the template for the TreeView nodes ([more information and example]({% slug nodetemplate_treeview %})).
 * The template helps to customize the content of the nodes. To define the node template, nest an `<ng-template>`
 * tag with the `kendoTreeViewNodeTemplate` directive inside a `<kendo-treeview>` tag.
 *
 *
 * The node data item and its hierarchical index are available as context variables:
 *
 * - `let-dataItem` (`any`) - available as implicit context variable
 * - `let-index="index"` (`string`)
 *
 *
 * @example
 * ```ts
 *
 *  import { Component } from '@angular/core';
 *  @Component({
 *      selector: 'my-app',
 *      template: `
 *      <kendo-treeview
 *          [nodes]="data"
 *          kendoTreeViewExpandable
 *
 *          kendoTreeViewHierarchyBinding
 *          childrenField="items">
 *        <ng-template kendoTreeViewNodeTemplate let-dataItem let-index="index">
 *          <span [style.fontWeight]="dataItem.items ? 'bolder': 'normal' ">{{ index }}: {{ dataItem.text }}</span>
 *        </ng-template>
 *      </kendo-treeview>
 *    `
 *  })
 *  export class AppComponent {
 *      public data: any[] = [
 *          {
 *              text: "Inbox",
 *              items: [{ text: "Read Mail" }]
 *          },
 *          {
 *              text: "Drafts"
 *          },
 *          {
 *              text: "Search Folders",
 *              items: [
 *                  { text: "Categorized Mail" },
 *                  { text: "Large Mail" },
 *                  { text: "Unread Mail"}
 *              ]
 *          },
 *          { text: "Settings" }
 *      ];
 *  }
 *
 * ```
 */
let NodeTemplateDirective = class NodeTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
};
NodeTemplateDirective = tslib_1.__decorate([
    Directive({
        selector: '[kendoTreeViewNodeTemplate]'
    }),
    tslib_1.__param(0, Optional()),
    tslib_1.__metadata("design:paramtypes", [TemplateRef])
], NodeTemplateDirective);
export { NodeTemplateDirective };
