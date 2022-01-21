/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriDrawerModule } from '@gradii/triangle/drawer';
import { DevDrawer } from './dev-drawer';
import { TriDemoDrawerBasicComponent } from './tri-demo-drawer/tri-demo-drawer-basic.component';


@NgModule({
  imports     : [
    CommonModule,
    TriDrawerModule,

    RouterModule.forChild([
      {
        path: '', component: DevDrawer, children: [
          {path: 'tri-demo-drawer-basic', component: TriDemoDrawerBasicComponent}
        ]
      }
    ]),
    TriButtonModule,
  ],
  declarations: [
    DevDrawer,

    TriDemoDrawerBasicComponent
  ]
})
export class DevDrawerModule {
}
