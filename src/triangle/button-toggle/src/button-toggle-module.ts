/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { TriCommonModule, TriRippleModule } from '@gradii/triangle/core';
import { TriButtonToggle } from './button-toggle';
import { TriButtonToggleGroup } from './button-toggle-group';

@NgModule({
  imports     : [TriCommonModule, TriRippleModule],
  exports     : [TriCommonModule, TriButtonToggleGroup, TriButtonToggle],
  declarations: [TriButtonToggleGroup, TriButtonToggle],
})
export class TriButtonToggleModule {
}
