/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { DevDialog } from './dev-dialog';
import {
  DialogDummy,
  TriDemoDialogBasicComponent
} from './tri-demo-dialog/tri-demo-dialog-basic.component';


@NgModule({
  imports     : [
    CommonModule,
    TriButtonModule,
    TriCardModule,

    TriDialogModule,

    RouterModule.forChild([
      {
        path: '', component: DevDialog, children: [
          {path: 'tri-demo-dialog-basic', component: TriDemoDialogBasicComponent}
        ]
      }
    ]),
    TriButtonModule,
  ],
  declarations: [
    DevDialog,

    DialogDummy,

    TriDemoDialogBasicComponent
  ]
})
export class DevDialogModule {
}
