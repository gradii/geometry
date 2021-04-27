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
import { TriPopoverModule } from '@gradii/triangle/popover';
import { DevPopoverComponent } from './dev-popover.component';
import { PopoverAutoHideExample } from './tri-demo-popover/popover-auto-hide/popover-auto-hide-example';
import { PopoverCustomClassExample } from './tri-demo-popover/popover-custom-class/popover-custom-class-example';
import { PopoverDelayExample } from './tri-demo-popover/popover-delay/popover-delay-example';
import { PopoverDisabledExample } from './tri-demo-popover/popover-disabled/popover-disabled-example';
import { PopoverHarnessExample } from './tri-demo-popover/popover-harness/popover-harness-example';
import { PopoverManualExample } from './tri-demo-popover/popover-manual/popover-manual-example';
import { PopoverMessageExample } from './tri-demo-popover/popover-message/popover-message-example';
import { PopoverModifiedDefaultsExample } from './tri-demo-popover/popover-modified-defaults/popover-modified-defaults-example';
import { PopoverOverviewExample } from './tri-demo-popover/popover-overview/popover-overview-example';
import { PopoverPlacementsExample } from './tri-demo-popover/popover-placements/popover-placements-example';
import { PopoverPositionExample } from './tri-demo-popover/popover-position/popover-position-example';
import { PopoverDynamicContentExample } from './tri-demo-popover/popover-dynamic-content/popover-dynamic-content-example';
import { PopoverTitleExample } from './tri-demo-popover/popover-title/popover-title-example';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TriCheckboxModule,
    TriInputModule,
    TriButtonModule,
    TriSelectModule,
    TriPopoverModule,

    RouterModule.forChild([
      {
        path: '', component: DevPopoverComponent, children: [
          {path: 'popover-auto-hide', component: PopoverAutoHideExample},
          {path: 'popover-custom-class', component: PopoverCustomClassExample},
          {path: 'popover-delay', component: PopoverDelayExample},
          {path: 'popover-disabled', component: PopoverDisabledExample},
          {path: 'popover-harness', component: PopoverHarnessExample},
          {path: 'popover-manual', component: PopoverManualExample},
          {path: 'popover-message', component: PopoverMessageExample},
          {path: 'popover-modified-defaults', component: PopoverModifiedDefaultsExample},
          {path: 'popover-overview', component: PopoverOverviewExample},
          {path: 'popover-position', component: PopoverPositionExample},
          {path: 'popover-placements', component: PopoverPlacementsExample},
          {path: 'popover-dynamic-content', component: PopoverDynamicContentExample},
          {path: 'popover-title-content', component: PopoverTitleExample},
        ]
      }
    ]),

  ],
  declarations: [
    DevPopoverComponent,

    PopoverAutoHideExample,
    PopoverCustomClassExample,
    PopoverDelayExample,
    PopoverDisabledExample,
    PopoverHarnessExample,
    PopoverManualExample,
    PopoverMessageExample,
    PopoverModifiedDefaultsExample,
    PopoverOverviewExample,
    PopoverPositionExample,
    PopoverPlacementsExample,
    PopoverDynamicContentExample,
    PopoverTitleExample
  ]
})
export class DevPopoverModule {

}
