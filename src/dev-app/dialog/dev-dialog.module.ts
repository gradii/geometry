/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { DevDialog } from './dev-dialog';
import { TriDemoDialogBasicComponent } from './tri-demo-dialog/tri-demo-dialog-basic.component';


@NgModule({
  imports     : [
    CommonModule,
    TriDialogModule,

    RouterModule.forChild([
      {
        path: '', component: DevDialog, children: [
          {path: 'tri-demo-dialog-basic', component: TriDemoDialogBasicComponent}
        ]
      }
    ]),
  ],
  declarations: [
    DevDialog,

    TriDemoDialogBasicComponent
  ]
})
export class DevDialogModule {
}
