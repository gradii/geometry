/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { DevTabsComponent } from './dev-tabs.component';
import { TabGroupAlignExample } from './tri-demo-tabs/tab-group-align/tab-group-align-example';
import { TabGroupAnimationsExample } from './tri-demo-tabs/tab-group-animations/tab-group-animations-example';
import { TabGroupAsyncExample } from './tri-demo-tabs/tab-group-async/tab-group-async-example';
import { TabGroupBasicExample } from './tri-demo-tabs/tab-group-basic/tab-group-basic-example';
import { TabGroupCustomLabelExample } from './tri-demo-tabs/tab-group-custom-label/tab-group-custom-label-example';
import { TabGroupDynamicHeightExample } from './tri-demo-tabs/tab-group-dynamic-height/tab-group-dynamic-height-example';
import { TabGroupDynamicExample } from './tri-demo-tabs/tab-group-dynamic/tab-group-dynamic-example';
import { TabGroupHarnessExample } from './tri-demo-tabs/tab-group-harness/tab-group-harness-example';
import { TabGroupHeaderBelowExample } from './tri-demo-tabs/tab-group-header-below/tab-group-header-below-example';
import { TabGroupLazyLoadedExample } from './tri-demo-tabs/tab-group-lazy-loaded/tab-group-lazy-loaded-example';
import { TabGroupStretchedExample } from './tri-demo-tabs/tab-group-stretched/tab-group-stretched-example';
import { TabGroupThemeExample } from './tri-demo-tabs/tab-group-theme/tab-group-theme-example';
import { TabNavBarBasicExample } from './tri-demo-tabs/tab-nav-bar-basic/tab-nav-bar-basic-example';
import { TriDemoTabsBasicComponent } from './tri-demo-tabs/tri-demo-tabs-basic.component';
import { TriDemoTabsSegmentComponent } from './tri-demo-tabs/tri-demo-tabs-segment.component';

@NgModule({
  imports: [
    CommonModule,

    TriTabsModule,
    TriInputModule,
    TriCheckboxModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild([
      {
        path: '', component: DevTabsComponent, children: [
          {path: 'tri-demo-tabs-basic', component: TriDemoTabsBasicComponent},
          {path: 'tri-demo-tabs-segment', component: TriDemoTabsSegmentComponent},

          {path: 'tri-demo-tab-group-align', component: TabGroupAlignExample},
          {path: 'tri-demo-tab-group-animations', component: TabGroupAnimationsExample},
          {path: 'tri-demo-tab-group-async', component: TabGroupAsyncExample},
          {path: 'tri-demo-tab-group-basic', component: TabGroupBasicExample},
          {path: 'tri-demo-tab-group-custom-label', component: TabGroupCustomLabelExample},
          {path: 'tri-demo-tab-group-dynamic', component: TabGroupDynamicExample},
          {path: 'tri-demo-tab-group-dynamic-height', component: TabGroupDynamicHeightExample},
          {path: 'tri-demo-tab-group-harness', component: TabGroupHarnessExample},
          {path: 'tri-demo-tab-group-header-below', component: TabGroupHeaderBelowExample},
          {path: 'tri-demo-tab-group-lazy-loaded', component: TabGroupLazyLoadedExample},
          {path: 'tri-demo-tab-group-stretched', component: TabGroupStretchedExample},
          {path: 'tri-demo-tab-group-theme', component: TabGroupThemeExample},
          {path: 'tri-demo-tab-nav-bar-basic', component: TabNavBarBasicExample},
        ]
      }
    ]),
    TriIconModule
  ],
  declarations: [
    DevTabsComponent,

    TriDemoTabsBasicComponent,
    TriDemoTabsSegmentComponent,

    TabGroupAlignExample,
    TabGroupAnimationsExample,
    TabGroupAsyncExample,
    TabGroupBasicExample,
    TabGroupCustomLabelExample,
    TabGroupDynamicExample,
    TabGroupDynamicHeightExample,
    TabGroupHarnessExample,
    TabGroupHeaderBelowExample,
    TabGroupLazyLoadedExample,
    TabGroupStretchedExample,
    TabGroupThemeExample,
    TabNavBarBasicExample,
  ]
})
export class DevTabsModule {

}
