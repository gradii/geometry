/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriInputModule } from '@gradii/triangle/input';
import { TriSelectModule } from '@gradii/triangle/select';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { DevTooltipComponent } from './dev-tooltip.component';
import { TooltipAutoHideExample } from './tri-demo-tooltip/tooltip-auto-hide/tooltip-auto-hide-example';
import { TooltipCustomClassExample } from './tri-demo-tooltip/tooltip-custom-class/tooltip-custom-class-example';
import { TooltipDelayExample } from './tri-demo-tooltip/tooltip-delay/tooltip-delay-example';
import { TooltipDisabledExample } from './tri-demo-tooltip/tooltip-disabled/tooltip-disabled-example';
import { TooltipHarnessExample } from './tri-demo-tooltip/tooltip-harness/tooltip-harness-example';
import { TooltipManualExample } from './tri-demo-tooltip/tooltip-manual/tooltip-manual-example';
import { TooltipMessageExample } from './tri-demo-tooltip/tooltip-message/tooltip-message-example';
import { TooltipModifiedDefaultsExample } from './tri-demo-tooltip/tooltip-modified-defaults/tooltip-modified-defaults-example';
import { TooltipOverviewExample } from './tri-demo-tooltip/tooltip-overview/tooltip-overview-example';
import { TooltipPlacementsExample } from './tri-demo-tooltip/tooltip-placements/tooltip-placements-example';
import { TooltipPositionExample } from './tri-demo-tooltip/tooltip-position/tooltip-position-example';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TriCheckboxModule,
    TriInputModule,
    TriButtonModule,
    TriSelectModule,
    TriTooltipModule,

    RouterModule.forChild([
      {
        path: '', component: DevTooltipComponent, children: [
          {path: 'tooltip-auto-hide', component: TooltipAutoHideExample},
          {path: 'tooltip-custom-class', component: TooltipCustomClassExample},
          {path: 'tooltip-delay', component: TooltipDelayExample},
          {path: 'tooltip-disabled', component: TooltipDisabledExample},
          {path: 'tooltip-harness', component: TooltipHarnessExample},
          {path: 'tooltip-manual', component: TooltipManualExample},
          {path: 'tooltip-message', component: TooltipMessageExample},
          {path: 'tooltip-modified-defaults', component: TooltipModifiedDefaultsExample},
          {path: 'tooltip-overview', component: TooltipOverviewExample},
          {path: 'tooltip-position', component: TooltipPositionExample},
          {path: 'tooltip-placements', component: TooltipPlacementsExample},
        ]
      }
    ]),

  ],
  declarations: [
    DevTooltipComponent,

    TooltipAutoHideExample,
    TooltipCustomClassExample,
    TooltipDelayExample,
    TooltipDisabledExample,
    TooltipHarnessExample,
    TooltipManualExample,
    TooltipMessageExample,
    TooltipModifiedDefaultsExample,
    TooltipOverviewExample,
    TooltipPositionExample,
    TooltipPlacementsExample
  ]
})
export class DevTooltipModule {

}
