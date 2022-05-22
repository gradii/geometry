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
import { DemoTreeViewBasicComponent } from './tri-demo-tree-view/demo-tree-view-basic.component';

@NgModule({
  imports     : [
    CommonModule,
    TriTreeViewModule,

    RouterModule.forChild([
      {
        path: '', component: DevTreeViewComponent, children: [
          {
            path     : 'tri-demo-tree-view-basic',
            component: DemoTreeViewBasicComponent
          },
        ]
      }
    ])
  ],
  declarations: [
    DevTreeViewComponent,

    DemoTreeViewBasicComponent
  ]
})
export class DevTreeViewModule {
}
