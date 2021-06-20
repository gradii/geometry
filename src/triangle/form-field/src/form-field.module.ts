/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldComponent } from './form-field.component';
import { PrefixDirective } from './prefix.directive';
import { SuffixDirective } from './suffix.directive';

const COMPONENTS = [
  FormFieldComponent,
  PrefixDirective,
  SuffixDirective,
];

@NgModule({
  imports: [ CommonModule ],
  declarations: [ ...COMPONENTS ],
  exports: [ ...COMPONENTS ],
})
export class TriFormFieldModule {
}
