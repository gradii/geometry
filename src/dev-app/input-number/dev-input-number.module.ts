/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriInputNumberModule } from '@gradii/triangle/input-number';
import { DevInputNumberComponent } from './dev-input-number.component';

@NgModule({
  imports     : [
    TriInputNumberModule,
    RouterModule.forChild([
      {path: '', component: DevInputNumberComponent}
    ])
  ],
  declarations: [
    DevInputNumberComponent
  ]
})
export class DevInputNumberModule {

}