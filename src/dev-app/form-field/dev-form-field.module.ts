/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriFormFieldModule } from '@gradii/triangle/form-field';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriRadioModule } from '@gradii/triangle/radio';
import { TriSelectModule } from '@gradii/triangle/select';
import { DevFormField } from './dev-form-field';
import { FormFieldAppearanceExample } from './form-field-appearance/form-field-appearance-example';
import {
  FormFieldCustomControlExample, MyTelInput
} from './form-field-custom-control/form-field-custom-control-example';
import { FormFieldErrorExample } from './form-field-error/form-field-error-example';
import { FormFieldHarnessExample } from './form-field-harness/form-field-harness-example';
import { FormFieldHintExample } from './form-field-hint/form-field-hint-example';
import { FormFieldLabelExample } from './form-field-label/form-field-label-example';
import { FormFieldOverviewExample } from './form-field-overview/form-field-overview-example';
import {
  FormFieldPrefixSuffixExample
} from './form-field-prefix-suffix/form-field-prefix-suffix-example';
import { FormFieldThemingExample } from './form-field-theming/form-field-theming-example';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TriFormFieldModule,
    TriButtonModule,
    TriIconModule,
    TriSelectModule,
    TriInputModule,
    TriRadioModule,

    RouterModule.forChild([
      {
        path: '', component: DevFormField, children: [
          {path: 'form-field-appearance', component: FormFieldAppearanceExample},
          {path: 'form-field-custom-control', component: FormFieldCustomControlExample},
          {path: 'form-field-error', component: FormFieldErrorExample},
          {path: 'form-field-harness', component: FormFieldHarnessExample},
          {path: 'form-field-hint', component: FormFieldHintExample},
          {path: 'form-field-label', component: FormFieldLabelExample},
          {path: 'form-field-overview', component: FormFieldOverviewExample},
          {path: 'form-field-prefix-suffix', component: FormFieldPrefixSuffixExample},
          {path: 'form-field-theming', component: FormFieldThemingExample},
        ]
      }
    ]),
    TriCheckboxModule,

  ],
  declarations: [
    DevFormField,

    MyTelInput,

    FormFieldAppearanceExample,
    FormFieldCustomControlExample,
    FormFieldErrorExample,
    FormFieldHarnessExample,
    FormFieldHintExample,
    FormFieldLabelExample,
    FormFieldOverviewExample,
    FormFieldPrefixSuffixExample,
    FormFieldThemingExample,
  ]
})
export class DevFormFieldModule {
}
