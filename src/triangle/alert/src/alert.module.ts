/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule } from '@gradii/triangle/core';
import { TriIconModule } from '@gradii/triangle/icon';

import { AlertComponent } from './alert.component';
import { AlertDescriptionDirective, AlertIconDirective, AlertMessageDirective } from './alert.directive';

@NgModule({
  imports: [CommonModule, TriCommonModule, TriIconModule],
  declarations: [
    AlertComponent,
    AlertMessageDirective,
    AlertDescriptionDirective,
    AlertIconDirective
  ],
  exports: [
    AlertComponent,
    AlertMessageDirective,
    AlertDescriptionDirective,
    AlertIconDirective
  ],
})
export class TriAlertModule {
}
