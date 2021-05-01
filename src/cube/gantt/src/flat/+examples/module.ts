/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGanttFlatBasicExampleComponent } from './basic/basic.component';

@NgModule({
  declarations: [
    NgxGanttFlatBasicExampleComponent
  ],
  imports     : [CommonModule],
  exports     : [
    NgxGanttFlatBasicExampleComponent
  ],
  providers   : [],
})
export class NgxGanttFlatExamplesModule {
}
