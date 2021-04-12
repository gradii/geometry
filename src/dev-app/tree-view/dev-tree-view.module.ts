/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriTreeViewModule } from '@gradii/triangle/tree-view';
import { DevTreeViewComponent } from './dev-tree-view.component';
import { TriDemoTreeViewBasicComponent } from './tri-demo-tree-view/tri-demo-tree-view-basic.component';
import { TriDemoTreeViewVirtualScrollComponent } from './tri-demo-tree-view/tri-demo-tree-view-virtual-scroll.component';
import { TriDemoTreeViewDragDropComponent } from './tri-demo-tree-view/tri-demo-tree-view-drag-drop.component';

@NgModule({
  imports     : [
    CommonModule,
    TriTreeViewModule.forRoot(),

    RouterModule.forChild([
      {
        path: '', component: DevTreeViewComponent, children: [
          {
            path     : 'tri-demo-tree-view-basic',
            component: TriDemoTreeViewBasicComponent
          },
          {
            path     : 'tri-demo-tree-view-virtual-scroll',
            component: TriDemoTreeViewVirtualScrollComponent
          },
          {
            path     : 'tri-demo-tree-view-drag-drop',
            component: TriDemoTreeViewDragDropComponent
          },
        ]
      }
    ])
  ],
  declarations: [
    DevTreeViewComponent,

    TriDemoTreeViewBasicComponent,
    TriDemoTreeViewVirtualScrollComponent,
    TriDemoTreeViewDragDropComponent
  ]
})
export class DevTreeViewModule {
}
