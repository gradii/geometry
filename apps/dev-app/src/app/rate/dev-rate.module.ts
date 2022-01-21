/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriInputModule } from '@gradii/triangle/input';
import { TriRateModule } from '@gradii/triangle/rate';
import { DevRateComponent } from './dev-rate.component';
import { TriDemoRateBasicComponent } from './tri-demo-rate/tri-demo-rate-basic.component';
import { TriDemoRateControlComponent } from './tri-demo-rate/tri-demo-rate-control.component';
import { TriDemoRateDisabledComponent } from './tri-demo-rate/tri-demo-rate-disabled.component';
import { TriDemoRateHalfComponent } from './tri-demo-rate/tri-demo-rate-half.component';
import { TriDemoRateTextComponent } from './tri-demo-rate/tri-demo-rate-text.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TriInputModule,
    TriRateModule,

    RouterModule.forChild([
      {
        path: '', component: DevRateComponent, children: [
          { path: 'tri-demo-rate-basic', component: TriDemoRateBasicComponent },
          { path: 'tri-demo-rate-control', component: TriDemoRateControlComponent },
          { path: 'tri-demo-rate-disabled', component: TriDemoRateDisabledComponent },
          { path: 'tri-demo-rate-half', component: TriDemoRateHalfComponent },
          { path: 'tri-demo-rate-text', component: TriDemoRateTextComponent },
        ]
      }
    ])
  ],
  declarations: [
    DevRateComponent,

    TriDemoRateBasicComponent,
    TriDemoRateControlComponent,
    TriDemoRateDisabledComponent,
    TriDemoRateHalfComponent,
    TriDemoRateTextComponent,
  ]
})
export class DevRateModule {

}
