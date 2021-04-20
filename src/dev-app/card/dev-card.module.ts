/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriCardModule } from '@gradii/triangle/card';
import { TriGridModule } from '@gradii/triangle/grid';
import { DevCard } from './dev-card';
import { TriDemoCardBasicComponent } from './tri-demo-card/tri-demo-card-basic.component';
import { TriDemoCardBorderComponent } from './tri-demo-card/tri-demo-card-border.component';
import { TriDemoCardFlexComponent } from './tri-demo-card/tri-demo-card-flex.component';
import { TriDemoCardGridComponent } from './tri-demo-card/tri-demo-card-grid.component';
import { TriDemoCardInnerComponent } from './tri-demo-card/tri-demo-card-inner.component';
import { TriDemoCardLoadingComponent } from './tri-demo-card/tri-demo-card-loading.component';
import { TriDemoCardSimpleComponent } from './tri-demo-card/tri-demo-card-simple.component';


@NgModule({
  imports     : [
    CommonModule,
    TriGridModule,
    TriCardModule,

    RouterModule.forChild([
      {
        path: '', component: DevCard, children: [
          {path: 'tri-demo-card-basic', component: TriDemoCardBasicComponent},
          {path: 'tri-demo-card-border', component: TriDemoCardBorderComponent},
          {path: 'tri-demo-card-flex', component: TriDemoCardFlexComponent},
          {path: 'tri-demo-card-grid', component: TriDemoCardGridComponent},
          {path: 'tri-demo-card-inner', component: TriDemoCardInnerComponent},
          {path: 'tri-demo-card-loading', component: TriDemoCardLoadingComponent},
          {path: 'tri-demo-card-simple', component: TriDemoCardSimpleComponent},
        ]
      }
    ]),
  ],
  declarations: [
    DevCard,

    TriDemoCardBasicComponent,
    TriDemoCardBorderComponent,
    TriDemoCardFlexComponent,
    TriDemoCardGridComponent,
    TriDemoCardInnerComponent,
    TriDemoCardLoadingComponent,
    TriDemoCardSimpleComponent,
  ]
})
export class DevCardModule {
}
