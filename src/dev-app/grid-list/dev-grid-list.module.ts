/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriGridListModule } from '@gradii/triangle/grid-list';
import { DevGridListComponent } from './dev-grid-list.component';
import { GridListDynamicExample } from './tri-demo-grid-list/grid-list-dynamic/grid-list-dynamic-example';
import { GridListHarnessExample } from './tri-demo-grid-list/grid-list-harness/grid-list-harness-example';
import { GridListOverviewExample } from './tri-demo-grid-list/grid-list-overview/grid-list-overview-example';

@NgModule({
  imports     : [
    CommonModule,
    TriGridListModule,

    RouterModule.forChild([
      {
        path: '', component: DevGridListComponent, children: [

          {path: 'tri-demo-grid-list-dynamic', component: GridListDynamicExample},
          {path: 'tri-demo-grid-list-harness', component: GridListHarnessExample},
          {path: 'tri-demo-grid-list-overview', component: GridListOverviewExample},
        ]
      }
    ]),
  ],
  declarations: [
    DevGridListComponent,

    GridListDynamicExample,
    GridListHarnessExample,
    GridListOverviewExample,

  ]
})
export class DevGridListModule {

}
