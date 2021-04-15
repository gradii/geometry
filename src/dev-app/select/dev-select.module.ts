/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriSelectModule } from '@gradii/triangle/select';
import { DevSelect } from './dev-select';
import { TriDemoSelectBasicComponent } from './tri-demo-select/tri-demo-select-basic.component';
import { TriDemoSelectMultipleComponent } from './tri-demo-select/tri-demo-select-multiple.component';
import { TriDemoSelectMultipleChangeComponent } from './tri-demo-select/tri-demo-select-multiple-change.component';
import { TriDemoSelectSearchComponent } from './tri-demo-select/tri-demo-select-search.component';
import { TriDemoSelectSearchChangeComponent } from './tri-demo-select/tri-demo-select-search-change.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    TriSelectModule,

    RouterModule.forChild([
      {
        path: '', component: DevSelect, children: [
          {
            path: 'tri-demo-select-basic', component: TriDemoSelectBasicComponent
          },
          {
            path: 'tri-demo-select-multiple', component: TriDemoSelectMultipleComponent
          },
          {
            path: 'tri-demo-select-multiple-change', component: TriDemoSelectMultipleChangeComponent
          },
           {
            path: 'tri-demo-select-search', component: TriDemoSelectSearchComponent
          },
           {
            path: 'tri-demo-select-search-change', component: TriDemoSelectSearchChangeComponent
          }
        ]
      }
    ])
  ],
  declarations: [
    DevSelect,

    TriDemoSelectBasicComponent,
    TriDemoSelectMultipleComponent,
    TriDemoSelectMultipleChangeComponent,
    TriDemoSelectSearchComponent,
    TriDemoSelectSearchChangeComponent
  ]
})
export class DevSelectModule {

}
