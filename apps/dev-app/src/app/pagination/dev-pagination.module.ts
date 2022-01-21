/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriPaginationModule } from '@gradii/triangle/pagination';
import { DevPagination } from './dev-pagination';
import { TriDemoPaginationBasicComponent } from './tri-demo-pagination/tri-demo-pagination-basic.component';
import { TriDemoPaginationChangerComponent } from './tri-demo-pagination/tri-demo-pagination-changer.component';
import { TriDemoPaginationJumpComponent } from './tri-demo-pagination/tri-demo-pagination-jump.component';
import { TriDemoPaginationMiniComponent } from './tri-demo-pagination/tri-demo-pagination-mini.component';
import { TriDemoPaginationMoreComponent } from './tri-demo-pagination/tri-demo-pagination-more.component';
import { TriDemoPaginationSimpleComponent } from './tri-demo-pagination/tri-demo-pagination-simple.component';
import { TriDemoPaginationTotalComponent } from './tri-demo-pagination/tri-demo-pagination-total.component';


@NgModule({
  imports     : [
    CommonModule,

    TriPaginationModule,

    RouterModule.forChild([
      {
        path: '', component: DevPagination, children: [
          {path: 'tri-demo-pagination-basic', component: TriDemoPaginationBasicComponent},
          {path: 'tri-demo-pagination-changer', component: TriDemoPaginationChangerComponent},
          {path: 'tri-demo-pagination-jump', component: TriDemoPaginationJumpComponent},
          {path: 'tri-demo-pagination-mini', component: TriDemoPaginationMiniComponent},
          {path: 'tri-demo-pagination-more', component: TriDemoPaginationMoreComponent},
          {path: 'tri-demo-pagination-simple', component: TriDemoPaginationSimpleComponent},
          {path: 'tri-demo-pagination-total', component: TriDemoPaginationTotalComponent},
        ]
      }
    ]),
  ],
  declarations: [
    DevPagination,

    TriDemoPaginationBasicComponent,
    TriDemoPaginationChangerComponent,
    TriDemoPaginationJumpComponent,
    TriDemoPaginationMiniComponent,
    TriDemoPaginationMoreComponent,
    TriDemoPaginationSimpleComponent,
    TriDemoPaginationTotalComponent,
  ]
})
export class DevPaginationModule {
}
