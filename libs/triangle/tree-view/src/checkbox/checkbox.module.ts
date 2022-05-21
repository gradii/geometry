/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { CheckBoxComponent } from './checkbox.component';

const COMPONENT_DIRECTIVES = [
  CheckBoxComponent
];

@NgModule({
  declarations: [COMPONENT_DIRECTIVES],
  exports: [COMPONENT_DIRECTIVES]
})
export class CheckBoxModule {
}
