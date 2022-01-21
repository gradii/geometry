/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriRadioModule } from '@gradii/triangle/radio';
import { TriSelectModule } from '@gradii/triangle/select';
import { TriSidenavModule } from '@gradii/triangle/sidenav';
import { TriNavbarModule } from '@gradii/triangle/navbar';
import { TriDrawerModule } from '@gradii/triangle/drawer';
import { DevSidenav } from './dev-sidenav';

import { SidenavAutosizeExample } from './tri-demo-sidenav/sidenav-autosize/sidenav-autosize-example';
import { SidenavBackdropExample } from './tri-demo-sidenav/sidenav-backdrop/sidenav-backdrop-example';
import { SidenavDisableCloseExample } from './tri-demo-sidenav/sidenav-disable-close/sidenav-disable-close-example';
import { SidenavDrawerOverviewExample } from './tri-demo-sidenav/sidenav-drawer-overview/sidenav-drawer-overview-example';
import { SidenavFixedExample } from './tri-demo-sidenav/sidenav-fixed/sidenav-fixed-example';
import { SidenavHarnessExample } from './tri-demo-sidenav/sidenav-harness/sidenav-harness-example';
import { SidenavModeExample } from './tri-demo-sidenav/sidenav-mode/sidenav-mode-example';
import { SidenavOpenCloseExample } from './tri-demo-sidenav/sidenav-open-close/sidenav-open-close-example';
import { SidenavOverviewExample } from './tri-demo-sidenav/sidenav-overview/sidenav-overview-example';
import { SidenavPositionExample } from './tri-demo-sidenav/sidenav-position/sidenav-position-example';
import { SidenavResponsiveExample } from './tri-demo-sidenav/sidenav-responsive/sidenav-responsive-example';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TriRadioModule,
    TriCheckboxModule,
    TriDrawerModule,
    TriSidenavModule,
    TriIconModule,
    TriNavbarModule,
    TriButtonModule,
    TriInputModule,
    TriSelectModule,

    RouterModule.forChild([
      {
        path: '', component: DevSidenav, children: [
          {path: 'tri-demo-sidenav-autosize', component: SidenavAutosizeExample},
          {path: 'tri-demo-sidenav-backdrop', component: SidenavBackdropExample},
          {path: 'tri-demo-sidenav-disable-close', component: SidenavDisableCloseExample},
          {path: 'tri-demo-sidenav-drawer-overview', component: SidenavDrawerOverviewExample},
          {path: 'tri-demo-sidenav-fixed', component: SidenavFixedExample},
          {path: 'tri-demo-sidenav-harness', component: SidenavHarnessExample},
          {path: 'tri-demo-sidenav-mode', component: SidenavModeExample},
          {path: 'tri-demo-sidenav-open-close', component: SidenavOpenCloseExample},
          {path: 'tri-demo-sidenav-overview', component: SidenavOverviewExample},
          {path: 'tri-demo-sidenav-position', component: SidenavPositionExample},
          {path: 'tri-demo-sidenav-responsive', component: SidenavResponsiveExample},

        ]
      }
    ]),
    TriInputModule,

  ],
  declarations: [
    DevSidenav,

    SidenavAutosizeExample,
    SidenavBackdropExample,
    SidenavDisableCloseExample,
    SidenavDrawerOverviewExample,
    SidenavFixedExample,
    SidenavHarnessExample,
    SidenavModeExample,
    SidenavOpenCloseExample,
    SidenavOverviewExample,
    SidenavPositionExample,
    SidenavResponsiveExample,
  ]
})
export class DevSidenavModule {

}
