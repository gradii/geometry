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
import { TriSelectModule } from '@gradii/triangle/select';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { DevSelect } from './dev-select';
import { TriDemoSelectBasicComponent } from './tri-demo-select/tri-demo-select-basic.component';
import {
  TriDemoSelectCustomOptionComponent
} from './tri-demo-select/tri-demo-select-custom-option.component';
import { TriDemoSelectMultipleComponent } from './tri-demo-select/tri-demo-select-multiple.component';
import { TriDemoSelectSizeComponent } from './tri-demo-select/tri-demo-select-size.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TriRadioModule,
    TriSelectModule,

    RouterModule.forChild([
      {
        path: '', component: DevSelect, children: [
          {path: 'tri-demo-select-basic', component: TriDemoSelectBasicComponent},
          {path: 'tri-demo-select-multiple', component: TriDemoSelectMultipleComponent},
          {path: 'tri-demo-select-size', component: TriDemoSelectSizeComponent},
          {path: 'tri-demo-select-custom-option', component: TriDemoSelectCustomOptionComponent},
        ]
      }
    ]),
    TriTabsModule,

  ],
  declarations: [
    DevSelect,

    TriDemoSelectBasicComponent,
    TriDemoSelectMultipleComponent,
    TriDemoSelectSizeComponent,
    TriDemoSelectCustomOptionComponent
  ]
})
export class DevSelectModule {

}
