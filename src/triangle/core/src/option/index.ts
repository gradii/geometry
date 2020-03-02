/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TriRippleModule} from '../ripple/index';
import {TriPseudoCheckboxModule} from '../selection/index';
import {TriOption} from './option';
import {TriOptgroup} from './optgroup';


@NgModule({
  imports: [TriRippleModule, CommonModule, TriPseudoCheckboxModule],
  exports: [TriOption, TriOptgroup],
  declarations: [TriOption, TriOptgroup]
})
export class TriOptionModule {}


export * from './option';
export * from './optgroup';
