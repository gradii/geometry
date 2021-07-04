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
import { TriDatePickerModule } from '@gradii/triangle/date-picker';
import { TriFormModule } from '@gradii/triangle/form';
import { TriGridModule } from '@gradii/triangle/grid';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriInputNumberModule } from '@gradii/triangle/input-number';
import { TriRadioModule } from '@gradii/triangle/radio';
import { TriSelectModule } from '@gradii/triangle/select';
import { TriSliderModule } from '@gradii/triangle/slider';
import { TriTimePickerModule } from '@gradii/triangle/time-picker';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { DevForm } from './dev-form';
import { TriDemoFormAdvancedComponent } from './tri-demo-form/tri-demo-form-advanced.component';
import { TriDemoFormDynamicComponent } from './tri-demo-form/tri-demo-form-dynamic.component';
import { TriDemoFormHorizontalComponent } from './tri-demo-form/tri-demo-form-horizontal.component';
import { TriDemoFormInlineComponent } from './tri-demo-form/tri-demo-form-inline.component';
import { TriDemoFormLayoutComponent } from './tri-demo-form/tri-demo-form-layout.component';
import { TriDemoFormLoginComponent } from './tri-demo-form/tri-demo-form-login.component';
import { TriDemoFormMixComponent } from './tri-demo-form/tri-demo-form-mix.component';
import { TriDemoFormValidateDynamicComponent } from './tri-demo-form/tri-demo-form-validate-dynamic.component';
import { TriDemoFormValidateComponent } from './tri-demo-form/tri-demo-form-validate.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TriInputModule,
    TriFormModule,
    TriDatePickerModule,
    TriGridModule,
    TriRadioModule,
    TriSliderModule,
    TriInputNumberModule,
    TriTimePickerModule,
    TriSelectModule,
    TriTooltipModule,

    RouterModule.forChild([
      {
        path: '', component: DevForm, children: [
          {path: 'tri-demo-form-advanced', component: TriDemoFormAdvancedComponent},
          {path: 'tri-demo-form-dynamic', component: TriDemoFormDynamicComponent},
          {path: 'tri-demo-form-horizontal', component: TriDemoFormHorizontalComponent},
          {path: 'tri-demo-form-inline', component: TriDemoFormInlineComponent},
          {path: 'tri-demo-form-layout', component: TriDemoFormLayoutComponent},
          {path: 'tri-demo-form-login', component: TriDemoFormLoginComponent},
          {path: 'tri-demo-form-mix', component: TriDemoFormMixComponent},
          {path: 'tri-demo-form-validate', component: TriDemoFormValidateComponent},
          {path: 'tri-demo-form-validate-dynamic', component: TriDemoFormValidateDynamicComponent},
        ]
      }
    ]),
    TriButtonModule,
    TriIconModule,
  ],
  declarations: [
    DevForm,

    TriDemoFormAdvancedComponent,
    TriDemoFormDynamicComponent,
    TriDemoFormHorizontalComponent,
    TriDemoFormInlineComponent,
    TriDemoFormLayoutComponent,
    TriDemoFormLoginComponent,
    TriDemoFormMixComponent,
    TriDemoFormValidateDynamicComponent,
    TriDemoFormValidateComponent,
  ]
})
export class DevFormModule {
}
