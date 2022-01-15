/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule } from '@gradii/triangle/core';
import { TriError } from './error';
import { FormFieldComponent } from './form-field-component';
import { TriHint } from './hint';
import { InputFormFieldDirective } from './input-form-field/input-form-field-directive';
import { TriLabel } from './label';
import { TriPrefix } from './prefix';
import { TriSuffix } from './suffix';

@NgModule({
  declarations: [
    TriError,
    FormFieldComponent,
    TriHint,
    TriLabel,
    TriPrefix,
    TriSuffix,

    InputFormFieldDirective
  ],
  imports     : [CommonModule, TriCommonModule, ObserversModule],
  exports     : [
    TriCommonModule,
    TriError,
    FormFieldComponent,
    TriHint,
    TriLabel,
    TriPrefix,
    TriSuffix,

    InputFormFieldDirective
  ],
})
export class TriFormFieldModule {
}
