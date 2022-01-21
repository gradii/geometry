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
// import { TriDropDownModule } from '@gradii/triangle/dropdown';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriRadioModule } from '@gradii/triangle/radio';
import { DevButton } from './dev-button';
import { TriDemoButtonColorComponent } from './tri-demo-button/tri-demo-button-color.component';
import { TriDemoButtonDisabledComponent } from './tri-demo-button/tri-demo-button-disabled.component';
import { TriDemoButtonGhostComponent } from './tri-demo-button/tri-demo-button-ghost.component';
import { TriDemoButtonGroupComponent } from './tri-demo-button/tri-demo-button-group.component';
import { TriDemoButtonIconComponent } from './tri-demo-button/tri-demo-button-icon.component';
import { TriDemoButtonLoadingComponent } from './tri-demo-button/tri-demo-button-loading.component';
import { TriDemoButtonMultipleComponent } from './tri-demo-button/tri-demo-button-multiple.component';
import { TriDemoButtonSizeComponent } from './tri-demo-button/tri-demo-button-size.component';
import { TriDemoButtonTypeComponent } from './tri-demo-button/tri-demo-button-type.component';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriIconModule,
    TriButtonModule,
    TriRadioModule,
    // TriDropDownModule,
    TriCheckboxModule,

    RouterModule.forChild([
      {
        path: '', component: DevButton, children: [
          {path: 'tri-demo-button-color', component: TriDemoButtonColorComponent},
          {path: 'tri-demo-button-disabled', component: TriDemoButtonDisabledComponent},
          {path: 'tri-demo-button-ghost', component: TriDemoButtonGhostComponent},
          {path: 'tri-demo-button-group', component: TriDemoButtonGroupComponent},
          {path: 'tri-demo-button-icon', component: TriDemoButtonIconComponent},
          {path: 'tri-demo-button-loading', component: TriDemoButtonLoadingComponent},
          {path: 'tri-demo-button-multiple', component: TriDemoButtonMultipleComponent},
          {path: 'tri-demo-button-size', component: TriDemoButtonSizeComponent},
          {path: 'tri-demo-button-type', component: TriDemoButtonTypeComponent},
        ]
      }
    ]),
  ],
  declarations: [
    DevButton,

    TriDemoButtonColorComponent,
    TriDemoButtonDisabledComponent,
    TriDemoButtonGhostComponent,
    TriDemoButtonGroupComponent,
    TriDemoButtonIconComponent,
    TriDemoButtonLoadingComponent,
    TriDemoButtonMultipleComponent,
    TriDemoButtonSizeComponent,
    TriDemoButtonTypeComponent,
  ],
})
export class DevButtonModule {
}
