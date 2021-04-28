/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriBadgeModule } from '@gradii/triangle/badge';
import { TriButtonModule } from '@gradii/triangle/button';
import { DevBadgeComponent } from './dev-badge.component';
import { TriDemoBadgeAnimateComponent } from './tri-demo-badge/tri-demo-badge-animate.component';
import { TriDemoBadgeBasicComponent } from './tri-demo-badge/tri-demo-badge-basic.component';
import { TriDemoBadgeClickableComponent } from './tri-demo-badge/tri-demo-badge-clickable.component';
import { TriDemoBadgeDotComponent } from './tri-demo-badge/tri-demo-badge-dot.component';
import { TriDemoBadgeMyCeilComponent } from './tri-demo-badge/tri-demo-badge-my-ceil.component';
import { TriDemoBadgeOverflowComponent } from './tri-demo-badge/tri-demo-badge-overflow.component';
import { TriDemoBadgeStandalonesComponent } from './tri-demo-badge/tri-demo-badge-standalones.component';
import { TriDemoBadgeStatusComponent } from './tri-demo-badge/tri-demo-badge-status.component';

@NgModule({
  imports: [
    CommonModule,
    
    TriButtonModule,
    TriBadgeModule,

    RouterModule.forChild([
      {
        path: '', component: DevBadgeComponent, children: [
          { path: 'tri-demo-badge-animate', component: TriDemoBadgeAnimateComponent },
          { path: 'tri-demo-badge-basic', component: TriDemoBadgeBasicComponent },
          { path: 'tri-demo-badge-clickable', component: TriDemoBadgeClickableComponent },
          { path: 'tri-demo-badge-dot', component: TriDemoBadgeDotComponent },
          { path: 'tri-demo-badge-myceil', component: TriDemoBadgeMyCeilComponent },
          { path: 'tri-demo-badge-overflow', component: TriDemoBadgeOverflowComponent },
          { path: 'tri-demo-badge-standalones', component: TriDemoBadgeStandalonesComponent },
          { path: 'tri-demo-badge-status', component: TriDemoBadgeStatusComponent },
        ]
      }
    ])
  ],
  declarations: [
    DevBadgeComponent,

    TriDemoBadgeAnimateComponent,
    TriDemoBadgeBasicComponent,
    TriDemoBadgeClickableComponent,
    TriDemoBadgeDotComponent,
    TriDemoBadgeMyCeilComponent,
    TriDemoBadgeOverflowComponent,
    TriDemoBadgeStandalonesComponent,
    TriDemoBadgeStatusComponent,
  ]
})
export class DevBadgeModule {

}
