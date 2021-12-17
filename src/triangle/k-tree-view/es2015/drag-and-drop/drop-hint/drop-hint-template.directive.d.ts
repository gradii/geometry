/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { TemplateRef } from '@angular/core';
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
export declare class DropHintTemplateDirective {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
}
