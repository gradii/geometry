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
import { DevCombobox } from './dev-select';
import { TriDemoSelectBasicComponent } from './tri-demo-select/tri-demo-select-basic.component';
import { TriDemoSelectMultipleChangeComponent } from './tri-demo-select/tri-demo-select-multiple-change.component';
import { TriDemoSelectMultipleComponent } from './tri-demo-select/tri-demo-select-multiple.component';
import { TriDemoSelectSearchChangeComponent } from './tri-demo-select/tri-demo-select-search-change.component';
import { TriDemoSelectSearchComponent } from './tri-demo-select/tri-demo-select-search.component';
import { TriDemoSelectSizeComponent } from './tri-demo-select/tri-demo-select-size.component';
import { TriDemoSelectTagComponent } from './tri-demo-select/tri-demo-select-tag.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriRadioModule,
    TriSelectModule,

    RouterModule.forChild([
      {
        path: '', component: DevCombobox, children: [
          {path: 'tri-demo-select-basic', component: TriDemoSelectBasicComponent},
          {path: 'tri-demo-select-multiple', component: TriDemoSelectMultipleComponent},
          {
            path     : 'tri-demo-select-multiple-change',
            component: TriDemoSelectMultipleChangeComponent
          },
          {path: 'tri-demo-select-search', component: TriDemoSelectSearchComponent},
          {path: 'tri-demo-select-search-change', component: TriDemoSelectSearchChangeComponent},
          {path: 'tri-demo-select-size', component: TriDemoSelectSizeComponent},
          {path: 'tri-demo-select-tag', component: TriDemoSelectTagComponent}
        ]
      }
    ]),

  ],
  declarations: [
    DevCombobox,

    TriDemoSelectBasicComponent,
    TriDemoSelectMultipleComponent,
    TriDemoSelectMultipleChangeComponent,
    TriDemoSelectSearchComponent,
    TriDemoSelectSearchChangeComponent,
    TriDemoSelectSizeComponent,
    TriDemoSelectTagComponent
  ]
})
export class DevComboboxModule {

}
