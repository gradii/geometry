/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule } from '@gradii/triangle/core';

import { AlertComponent } from './alert.component';

@NgModule({
  declarations: [AlertComponent],
  exports     : [AlertComponent],
  imports     : [CommonModule, TriCommonModule]
})
export class TriAlertModule {
}
