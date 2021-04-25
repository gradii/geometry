/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriTransferModule } from '@gradii/triangle/transfer';
import { DevTransferComponent } from './dev-transfer.component';
import { TriDemoTransferBasicComponent } from './tri-demo-transfer/tri-demo-transfer-basic.component';


@NgModule({
  imports: [
    CommonModule,
    TriTransferModule,

    RouterModule.forChild([
      {
        path: '', component: DevTransferComponent, children: [
          { path: 'basic', component: TriDemoTransferBasicComponent }
        ]
      }
    ])
  ],
  declarations: [
    DevTransferComponent,

    TriDemoTransferBasicComponent
  ]
})
export class DevTransferModule {

}
