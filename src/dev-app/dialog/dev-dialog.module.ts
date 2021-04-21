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
  DialogBasic,
  TriDemoDialogBasicComponent
} from './tri-demo-dialog/tri-demo-dialog-basic.component';
import {
  DialogCard,
  TriDemoDialogCardComponent
} from './tri-demo-dialog/tri-demo-dialog-card.component';


@NgModule({
  imports     : [
    CommonModule,
    TriButtonModule,
    TriCardModule,

    TriDialogModule,

    RouterModule.forChild([
      {
        path: '', component: DevDialog, children: [
          {path: 'tri-demo-dialog-basic', component: TriDemoDialogBasicComponent},
          {path: 'tri-demo-dialog-card', component: TriDemoDialogCardComponent}
        ]
      }
    ]),
    TriButtonModule,
  ],
  declarations: [
    DevDialog,

    DialogCard,
    DialogBasic,

    TriDemoDialogBasicComponent,
    TriDemoDialogCardComponent
  ]
})
export class DevDialogModule {
}
