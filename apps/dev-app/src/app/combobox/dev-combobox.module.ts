/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriComboboxModule } from '@gradii/triangle/combobox';
import { TriRadioModule } from '@gradii/triangle/radio';
import { DevCombobox } from './dev-combobox';
import {
  TriDemoComboboxBasicComponent
} from './tri-demo-combobox/tri-demo-combobox-basic.component';
import {
  TriDemoComboboxMultipleChangeComponent
} from './tri-demo-combobox/tri-demo-combobox-multiple-change.component';
import {
  TriDemoComboboxMultipleComponent
} from './tri-demo-combobox/tri-demo-combobox-multiple.component';
import {
  TriDemoComboboxSearchChangeComponent
} from './tri-demo-combobox/tri-demo-combobox-search-change.component';
import {
  TriDemoComboboxSearchComponent
} from './tri-demo-combobox/tri-demo-combobox-search.component';
import { TriDemoComboboxSizeComponent } from './tri-demo-combobox/tri-demo-combobox-size.component';
import { TriDemoComboboxTagComponent } from './tri-demo-combobox/tri-demo-combobox-tag.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriRadioModule,
    TriComboboxModule,

    RouterModule.forChild([
      {
        path: '', component: DevCombobox, children: [
          {path: 'tri-demo-combobox-basic', component: TriDemoComboboxBasicComponent},
          {path: 'tri-demo-combobox-multiple', component: TriDemoComboboxMultipleComponent},
          {
            path     : 'tri-demo-combobox-multiple-change',
            component: TriDemoComboboxMultipleChangeComponent
          },
          {path: 'tri-demo-combobox-search', component: TriDemoComboboxSearchComponent},
          {path: 'tri-demo-combobox-search-change', component: TriDemoComboboxSearchChangeComponent},
          {path: 'tri-demo-combobox-size', component: TriDemoComboboxSizeComponent},
          {path: 'tri-demo-combobox-tag', component: TriDemoComboboxTagComponent}
        ]
      }
    ]),

  ],
  declarations: [
    DevCombobox,

    TriDemoComboboxBasicComponent,
    TriDemoComboboxMultipleComponent,
    TriDemoComboboxMultipleChangeComponent,
    TriDemoComboboxSearchComponent,
    TriDemoComboboxSearchChangeComponent,
    TriDemoComboboxSizeComponent,
    TriDemoComboboxTagComponent
  ]
})
export class DevComboboxModule {

}
