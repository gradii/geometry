/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
import { TreeViewGroupComponent } from './treeview-group.component';
import { CommonModule } from '@angular/common';
import { NodeTemplateDirective } from './node-template.directive';
import { CheckDirective } from './check.directive';
import { DisableDirective } from './disable.directive';
import { ExpandDirective } from './expand.directive';
import { SelectDirective } from './selection/select.directive';
import { HierarchyBindingDirective } from './hierarchy-binding.directive';
import { LoadingIndicatorDirective } from './loading-indicator.directive';
import { FlatDataBindingDirective } from './flat-binding.directive';
import { TreeViewItemDirective } from './treeview-item.directive';
import { TreeViewItemContentDirective } from './treeview-item-content.directive';
import { CheckBoxModule } from './checkbox/checkbox.module';
import { DragAndDropDirective } from './drag-and-drop/drag-and-drop.directive';
import { DragClueTemplateDirective } from './drag-and-drop/drag-clue/drag-clue-template.directive';
import { DropHintTemplateDirective } from './drag-and-drop/drop-hint/drop-hint-template.directive';
import { DragClueComponent } from './drag-and-drop/drag-clue/drag-clue.component';
import { DropHintComponent } from './drag-and-drop/drop-hint/drop-hint.component';
import { DragAndDropEditingDirective } from './drag-and-drop/drag-and-drop-editing.directive';
import { LoadMoreDirective } from './load-more/load-more.directive';
import { LoadMoreButtonTemplateDirective } from './load-more/load-more-button-template.directive';
import { InputsModule } from '@progress/kendo-angular-inputs';
const COMPONENT_DIRECTIVES = [
    TreeViewComponent,
    TreeViewGroupComponent,
    TreeViewItemDirective,
    TreeViewItemContentDirective,
    NodeTemplateDirective,
    CheckDirective,
    DisableDirective,
    ExpandDirective,
    SelectDirective,
    HierarchyBindingDirective,
    LoadingIndicatorDirective,
    FlatDataBindingDirective,
    DragAndDropDirective,
    DragClueTemplateDirective,
    DragClueComponent,
    DropHintTemplateDirective,
    DropHintComponent,
    DragAndDropEditingDirective,
    LoadMoreDirective,
    LoadMoreButtonTemplateDirective
];
/**
 * @hidden
 */
let SharedModule = class SharedModule {
};
SharedModule = tslib_1.__decorate([
    NgModule({
        declarations: [COMPONENT_DIRECTIVES],
        exports: [COMPONENT_DIRECTIVES],
        imports: [
            CommonModule,
            CheckBoxModule,
            InputsModule
        ],
        entryComponents: [
            DragClueComponent,
            DropHintComponent
        ]
    })
], SharedModule);
export { SharedModule };
