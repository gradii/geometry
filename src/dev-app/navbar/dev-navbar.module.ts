/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriNavbarModule } from '@gradii/triangle/navbar';
import { DevNavbarComponent } from './dev-navbar.component';
import { NavbarBasicExample } from './tri-demo-navbar/navbar-basic/navbar-basic-example';
import { NavbarHarnessExample } from './tri-demo-navbar/navbar-harness/navbar-harness-example';
import { NavbarMultirowExample } from './tri-demo-navbar/navbar-multirow/navbar-multirow-example';
import { NavbarOverviewExample } from './tri-demo-navbar/navbar-overview/navbar-overview-example';

@NgModule({
  imports     : [
    CommonModule,
    TriNavbarModule,
    TriButtonModule,
    TriIconModule,

    RouterModule.forChild([
      {
        path: '', component: DevNavbarComponent, children: [
          {path: 'tri-demo-navbar-basic', component: NavbarBasicExample},
          {path: 'tri-demo-navbar-harness', component: NavbarHarnessExample},
          {path: 'tri-demo-navbar-multirow', component: NavbarMultirowExample},
          {path: 'tri-demo-navbar-overview', component: NavbarOverviewExample},
        ]
      }
    ]),
  ],
  declarations: [
    DevNavbarComponent,

    NavbarBasicExample,
    NavbarHarnessExample,
    NavbarMultirowExample,
    NavbarOverviewExample,
  ]
})
export class DevNavbarModule {

}
