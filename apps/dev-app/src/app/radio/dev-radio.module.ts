/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriRadioModule } from '@gradii/triangle/radio';
import { DevRadio } from './dev-radio';
import { TriDemoRadioButtonGroupSizeComponent } from './tri-demo-radio/tri-demo-radio-button-group-size.component';
import { TriDemoRadioButtonGroupComponent } from './tri-demo-radio/tri-demo-radio-button-group.component';
import { TriDemoRadioGroupDisabledComponent } from './tri-demo-radio/tri-demo-radio-group-disabled.component';
import { TriDemoRadioGroupComponent } from './tri-demo-radio/tri-demo-radio-group.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriRadioModule,

    RouterModule.forChild([
      {
        path: '', component: DevRadio, children: [
          {path: 'tri-demo-radio-button-group', component: TriDemoRadioButtonGroupComponent},
          {
            path     : 'tri-demo-radio-button-group-size',
            component: TriDemoRadioButtonGroupSizeComponent
          },
          {path: 'tri-demo-radio-group', component: TriDemoRadioGroupComponent},
          {path: 'tri-demo-radio-group-disabled', component: TriDemoRadioGroupDisabledComponent},
        ]
      }
    ]),
  ],
  declarations: [
    DevRadio,

    TriDemoRadioButtonGroupComponent,
    TriDemoRadioButtonGroupSizeComponent,
    TriDemoRadioGroupComponent,
    TriDemoRadioGroupDisabledComponent,
  ]
})
export class DevRadioModule {
}
