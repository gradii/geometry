/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriTreeSelectModule } from '@gradii/triangle/tree-select';
import { DevTreeSelectComponent } from './dev-tree-select.component';
import { DemoTreeSelectBasicComponent } from './tri-demo-select/demo-tree-select-basic.component';

@NgModule({
  imports: [
    TriTreeSelectModule,

    RouterModule.forChild([
      {
        path: '', component: DevTreeSelectComponent, children: [
          { path: 'demo-tree-select-basic-component', component: DemoTreeSelectBasicComponent }
        ]
      }
    ])
  ],
  declarations: [
    DevTreeSelectComponent,

    DemoTreeSelectBasicComponent
  ]
})
export class DevTreeSelectModule {

}
