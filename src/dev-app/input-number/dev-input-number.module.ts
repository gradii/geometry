/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriInputNumberModule } from '@gradii/triangle/input-number';
import { DevInputNumber } from './dev-input-number';


@NgModule({
  imports     : [
    TriInputNumberModule,
    RouterModule.forChild([
      {path: '', component: DevInputNumber}
    ])
  ],
  declarations: [
    DevInputNumber
  ]
})
export class DevInputNumberModule {

}