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
import { OptionContainerComponent } from './option-container.component';
import { SelectTopControlComponent } from './select-top-control.component';
import { SelectComponent } from './select.component';
import { SelectUnselectableDirective } from '@gradii/triangle/select';

@NgModule({
    imports: [
      CommonModule,

      FormsModule,
      OverlayModule,
      TriIconModule,
      OverlayModule,
      TriCommonModule,
    ],
    declarations: [
      SelectComponent,
      OptionContainerComponent,
      SelectTopControlComponent,
      SelectUnselectableDirective
    ],
    exports: [
      SelectComponent,
      OptionContainerComponent,
    ]
})
export class TriTreeSelectModule {

}
