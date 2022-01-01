/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriButtonToggleModule } from '@gradii/triangle/button-toggle';
import { TriIconModule } from '@gradii/triangle/icon';
import {
  ButtonToggleAppearanceExample
} from './button-toggle-appearance/button-toggle-appearance-example';
import {
  ButtonToggleExclusiveExample
} from './button-toggle-exclusive/button-toggle-exclusive-example';
import { ButtonToggleFormsExample } from './button-toggle-forms/button-toggle-forms-example';
import { ButtonToggleHarnessExample } from './button-toggle-harness/button-toggle-harness-example';
import { ButtonToggleModeExample } from './button-toggle-mode/button-toggle-mode-example';
import {
  ButtonToggleOverviewExample
} from './button-toggle-overview/button-toggle-overview-example';
import { DevButtonToggle } from './dev-button-toggle';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TriButtonToggleModule,

    RouterModule.forChild([
      {
        path: '', component: DevButtonToggle, children: [
          {path: 'button-toggle-appearance', component: ButtonToggleAppearanceExample},
          {path: 'button-toggle-exclusive', component: ButtonToggleExclusiveExample},
          {path: 'button-toggle-forms', component: ButtonToggleFormsExample},
          {path: 'button-toggle-harness', component: ButtonToggleHarnessExample},
          {path: 'button-toggle-mode', component: ButtonToggleModeExample},
          {path: 'button-toggle-overview', component: ButtonToggleOverviewExample},
        ]
      }
    ]),
    TriIconModule,
  ],
  declarations: [
    DevButtonToggle,

    ButtonToggleAppearanceExample,
    ButtonToggleExclusiveExample,
    ButtonToggleFormsExample,
    ButtonToggleHarnessExample,
    ButtonToggleModeExample,
    ButtonToggleOverviewExample,
  ],
})
export class DevButtonToggleModule {
}
