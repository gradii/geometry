/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriPseudoCheckboxModule } from '../selection/index';
import { OptionGroupComponent } from './option-group.component';
import { OptionComponent } from './option.component';

@NgModule({
  imports     : [CommonModule, TriPseudoCheckboxModule],
  exports     : [TriPseudoCheckboxModule, OptionComponent, OptionGroupComponent],
  declarations: [OptionComponent, OptionGroupComponent]
})
export class TriOptionModule {}


export * from './option.component';
export * from './option-group.component';
