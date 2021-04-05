/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriInputNumberModule } from '@gradii/triangle/input-number';
import { DevInputNumber } from './dev-input-number';
import { TriDemoInputNumberBasicComponent } from './tri-demo-input-number/tri-demo-input-number-basic.component';
import { TriDemoInputNumberDigitComponent } from './tri-demo-input-number/tri-demo-input-number-digit.component';
import { TriDemoInputNumberDisabledComponent } from './tri-demo-input-number/tri-demo-input-number-disabled.component';
import { TriDemoInputNumberFocusedComponent } from './tri-demo-input-number/tri-demo-input-number-focused.component';
import { TriDemoInputNumberSizeComponent } from './tri-demo-input-number/tri-demo-input-number-size.component';


@NgModule({
  imports     : [
    FormsModule,
    TriInputNumberModule,

    RouterModule.forChild([
      {
        path: '', component: DevInputNumber, children: [
          {path: 'tri-demo-input-number-basic', component: TriDemoInputNumberBasicComponent},
          {path: 'tri-demo-input-number-digit', component: TriDemoInputNumberDigitComponent},
          {path: 'tri-demo-input-number-disabled', component: TriDemoInputNumberDisabledComponent},
          {path: 'tri-demo-input-number-focused', component: TriDemoInputNumberFocusedComponent},
          {path: 'tri-demo-input-number-size', component: TriDemoInputNumberSizeComponent},
        ]
      }
    ])
  ],
  declarations: [
    DevInputNumber,

    TriDemoInputNumberBasicComponent,
    TriDemoInputNumberDigitComponent,
    TriDemoInputNumberDisabledComponent,
    TriDemoInputNumberFocusedComponent,
    TriDemoInputNumberSizeComponent,
  ]
})
export class DevInputNumberModule {

}