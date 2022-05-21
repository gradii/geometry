/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriInputModule } from '@gradii/triangle/input';
import { CheckDirective } from './check.directive';
import { CheckBoxModule } from './checkbox/checkbox.module';
import { DisableDirective } from './disable.directive';
import { DragAndDropEditingDirective } from './drag-and-drop/drag-and-drop-editing.directive';
import { DragAndDropDirective } from './drag-and-drop/drag-and-drop.directive';
import { DragClueTemplateDirective } from './drag-and-drop/drag-clue/drag-clue-template.directive';
import { DragClueComponent } from './drag-and-drop/drag-clue/drag-clue.component';
import { DropHintTemplateDirective } from './drag-and-drop/drop-hint/drop-hint-template.directive';
import { DropHintComponent } from './drag-and-drop/drop-hint/drop-hint.component';
import { ExpandDirective } from './expand.directive';
import { FlatDataBindingDirective } from './flat-binding.directive';
import { HierarchyBindingDirective } from './hierarchy-binding.directive';
import { LoadMoreButtonTemplateDirective } from './load-more/load-more-button-template.directive';
import { LoadMoreDirective } from './load-more/load-more.directive';
import { LoadingIndicatorDirective } from './loading-indicator.directive';
import { NodeTemplateDirective } from './node-template.directive';
import { SelectDirective } from './selection/select.directive';
import { TreeViewGroupComponent } from './treeview-group.component';
import { TreeViewItemContentDirective } from './treeview-item-content.directive';
import { TreeViewItemDirective } from './treeview-item.directive';
import { TreeViewComponent } from './treeview.component';

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

@NgModule({
  declarations: [COMPONENT_DIRECTIVES],
  exports: [COMPONENT_DIRECTIVES],
  imports: [
    CommonModule,
    CheckBoxModule,
    TriInputModule
  ],
  entryComponents: [
    DragClueComponent,
    DropHintComponent
  ]
})
export class SharedModule {
}
