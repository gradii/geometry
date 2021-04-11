/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TreeViewModule } from '@gradii/triangle/tree-view';
import { DevTreeViewComponent } from './dev-tree-view.component';
import { TriDemoTreeViewBasicComponent } from './tri-demo-tree-view/tri-demo-tree-view-basic.component';

@NgModule({
  imports     : [
    CommonModule,
    TreeViewModule.forRoot(),

    RouterModule.forChild([
      {
        path: '', component: DevTreeViewComponent, children: [
          {path: 'tri-demo-tree-view-basic', component: TriDemoTreeViewBasicComponent},
        ]
      }
    ])
  ],
  declarations: [
    DevTreeViewComponent,

    TriDemoTreeViewBasicComponent,
  ]
})
export class DevTreeViewModule {

}