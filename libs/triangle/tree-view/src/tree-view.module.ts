/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TriPseudoCheckboxModule } from '@gradii/triangle/core';
import { TriIconModule } from '@gradii/triangle/icon';

import { TreeLoadingComponent } from './components/tree-loading.component';
import { TreeNodeContentComponent } from './components/tree-node-content.component';
import { TreeNodeDropSlotComponent } from './components/tree-node-drop-slot.component';
import { TreeNodeItemComponent } from './components/tree-node-item.component';
import { TreeNodeToggleComponent } from './components/tree-node-toggle.component';
import { TreeNodeChildrenComponent, TreeNodeComponent } from './components/tree-node.component';
import { TreeViewportComponent } from './components/tree-viewport.component';
import { TreeComponent } from './components/tree.component';
import { TreeDragDirective } from './directives/tree-drag.directive';
import { TreeDropDirective } from './directives/tree-drop.directive';
import { TreeDraggingTargetService } from './services/tree-dragging-target.service';
import { VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA } from './services/tree-virtual-scroll.service';


@NgModule({
  imports     : [
    CommonModule,

    TriPseudoCheckboxModule,
    TriIconModule
  ],
  declarations: [
    TreeLoadingComponent,
    TreeNodeComponent,
    TreeComponent,
    TreeNodeToggleComponent,
    TreeNodeItemComponent,
    TreeNodeChildrenComponent,
    TreeNodeContentComponent,
    TreeViewportComponent,
    TreeNodeDropSlotComponent,
    TreeDragDirective,
    TreeDropDirective,
  ],
  exports     : [
    TreeComponent,
    TreeDragDirective,
    TreeDropDirective,
  ],
  providers   : []
})
export class TriTreeViewModule {
  static forRoot(): ModuleWithProviders<TriTreeViewModule> {
    return {
      ngModule : TriTreeViewModule,
      providers: [
        TreeDraggingTargetService,
        {
          provide : VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA,
          useValue: 5,
        },
      ],
    };
  }
}
