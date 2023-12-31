/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriCommonModule } from '@gradii/triangle/core';


import { TriIconModule } from '@gradii/triangle/icon';
import { ComboboxOptionComponent } from './combobox-option.component';
import { ComboboxComponent } from './combobox.component';
import { OptionContainerComponent } from './option-container.component';
import { OptionGroupComponent } from './option-group.component';
import { OptionLiComponent } from './option-li.component';
import { FilterGroupOptionPipe, FilterOptionPipe } from './option.pipe';
import { SelectTopControlComponent } from './select-top-control.component';
import { SelectUnselectableDirective } from './select-unselectable.directive';

@NgModule({
  imports     : [
    CommonModule,

    FormsModule,
    OverlayModule,
    TriIconModule,
    OverlayModule,
    TriCommonModule,
  ],
  declarations: [
    FilterGroupOptionPipe,
    FilterOptionPipe,
    ComboboxOptionComponent,
    ComboboxComponent,
    OptionContainerComponent,
    OptionGroupComponent,
    OptionLiComponent,
    SelectTopControlComponent,
    SelectUnselectableDirective
  ],
  exports     : [
    ComboboxOptionComponent,
    ComboboxComponent,
    OptionContainerComponent,
    OptionGroupComponent,
  ]
})
export class TriComboboxModule {
}
