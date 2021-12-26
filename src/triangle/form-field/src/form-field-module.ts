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
import { TriFormField } from './form-field';
import { TriHint } from './hint';
import { TriLabel } from './label';
import { TriPrefix } from './prefix';
import { TriSuffix } from './suffix';

@NgModule({
  declarations: [TriError, TriFormField, TriHint, TriLabel, TriPrefix, TriSuffix],
  imports     : [CommonModule, TriCommonModule, ObserversModule],
  exports     : [
    TriCommonModule,
    TriError,
    TriFormField,
    TriHint,
    TriLabel,
    TriPrefix,
    TriSuffix,
  ],
})
export class TriFormFieldModule {
}
