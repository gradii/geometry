/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { DevCheckbox } from './dev-checkbox';
import { TriDemoCheckboxBasicComponent } from './tri-demo-checkbox/tri-demo-checkbox-basic.component';
import { TriDemoCheckboxControllerComponent } from './tri-demo-checkbox/tri-demo-checkbox-controller.component';
import { TriDemoCheckboxDisabledComponent } from './tri-demo-checkbox/tri-demo-checkbox-disabled.component';
import { TriDemoCheckboxGroupComponent } from './tri-demo-checkbox/tri-demo-checkbox-group.component';
import { TriDemoCheckboxIndeterminateComponent } from './tri-demo-checkbox/tri-demo-checkbox-indeterminate.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriButtonModule,
    TriCheckboxModule,

    RouterModule.forChild([
      {
        path: '', component: DevCheckbox, children: [
          {path: 'tri-demo-checkbox-basic', component: TriDemoCheckboxBasicComponent},
          {path: 'tri-demo-checkbox-controller', component: TriDemoCheckboxControllerComponent},
          {path: 'tri-demo-checkbox-disabled', component: TriDemoCheckboxDisabledComponent},
          {path: 'tri-demo-checkbox-group', component: TriDemoCheckboxGroupComponent},
          {
            path     : 'tri-demo-checkbox-indeterminate',
            component: TriDemoCheckboxIndeterminateComponent
          },
        ]
      }
    ]),
  ],
  declarations: [
    DevCheckbox,

    TriDemoCheckboxControllerComponent,
    TriDemoCheckboxDisabledComponent,
    TriDemoCheckboxGroupComponent,
    TriDemoCheckboxIndeterminateComponent,
    TriDemoCheckboxBasicComponent,
  ],
})
export class DevCheckboxModule {
}
