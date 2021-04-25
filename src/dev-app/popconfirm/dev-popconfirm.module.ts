/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriMessageModule } from '@gradii/triangle/message';
import { TriPopConfirmModule } from '@gradii/triangle/popconfirm';
import { DevPopconfirm } from './dev-popconfirm';
import { TriDemoPopconfirmBasicComponent } from './tri-demo-popconfirm/tri-demo-popconfirm-basic.component';
import { TriDemoPopconfirmKickComponent } from './tri-demo-popconfirm/tri-demo-popconfirm-kick.component';
import { TriDemoPopconfirmLocalComponent } from './tri-demo-popconfirm/tri-demo-popconfirm-locale.component';
import { TriDemoPopconfirmLocationComponent } from './tri-demo-popconfirm/tri-demo-popconfirm-location.component';



@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriMessageModule,
    TriPopConfirmModule,

    RouterModule.forChild([
      {
        path: '', component: DevPopconfirm, children: [
          {path: 'tri-demo-popconfirm-basic', component: TriDemoPopconfirmBasicComponent},
          {path: 'tri-demo-popconfirm-kick', component: TriDemoPopconfirmKickComponent},
          {path: 'tri-demo-popconfirm-locale', component: TriDemoPopconfirmLocalComponent},
          {path: 'tri-demo-popconfirm-location', component: TriDemoPopconfirmLocationComponent},
        ]
      }
    ]),
  ],
  declarations: [
    DevPopconfirm,

    TriDemoPopconfirmBasicComponent,
    TriDemoPopconfirmKickComponent,
    TriDemoPopconfirmLocalComponent,
    TriDemoPopconfirmLocationComponent,
  ]
})
export class DevPopconfirmModule {
}
