/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
import { SharedModule } from './shared.module';
import { NodeTemplateDirective } from './node-template.directive';
import { CheckDirective } from './check.directive';
import { DisableDirective } from './disable.directive';
import { ExpandDirective } from './expand.directive';
import { SelectDirective } from './selection/select.directive';
import { HierarchyBindingDirective } from './hierarchy-binding.directive';
import { FlatDataBindingDirective } from './flat-binding.directive';
import { DragAndDropDirective } from './drag-and-drop/drag-and-drop.directive';
import { DragClueTemplateDirective } from './drag-and-drop/drag-clue/drag-clue-template.directive';
import { DropHintTemplateDirective } from './drag-and-drop/drop-hint/drop-hint-template.directive';
import { DragAndDropEditingDirective } from './drag-and-drop/drag-and-drop-editing.directive';
import { LoadMoreDirective } from './load-more/load-more.directive';
import { LoadMoreButtonTemplateDirective } from './load-more/load-more-button-template.directive';

const EXPORTS = [
  TreeViewComponent,
  NodeTemplateDirective,
  CheckDirective,
  DisableDirective,
  ExpandDirective,
  SelectDirective,
  HierarchyBindingDirective,
  FlatDataBindingDirective,
  DragAndDropDirective,
  DragClueTemplateDirective,
  DropHintTemplateDirective,
  DragAndDropEditingDirective,
  LoadMoreDirective,
  LoadMoreButtonTemplateDirective
];

@NgModule({
  exports: [EXPORTS],
  imports: [SharedModule]
})
export class TriTreeViewModule {
}
