/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriCollapseModule } from '@gradii/triangle/collapse';
import { DevCollapse } from './dev-collapse';
import { TriDemoCollapseAccordionComponent } from './tri-demo-collapse/tri-demo-collapse-accordion.component';
import { TriDemoCollapseBasicComponent } from './tri-demo-collapse/tri-demo-collapse-basic.component';
import { TriDemoCollapseBorderComponent } from './tri-demo-collapse/tri-demo-collapse-border.component';
import { TriDemoCollapseCustomComponent } from './tri-demo-collapse/tri-demo-collapse-custom.component';
import { TriDemoCollapseNestComponent } from './tri-demo-collapse/tri-demo-collapse-nest.component';


@NgModule({
  imports     : [
    CommonModule,
    TriCollapseModule,

    RouterModule.forChild([
      {
        path: '', component: DevCollapse, children: [
          {path: 'tri-demo-collapse-accordion', component: TriDemoCollapseAccordionComponent},
          {path: 'tri-demo-collapse-basic', component: TriDemoCollapseBasicComponent},
          {path: 'tri-demo-collapse-border', component: TriDemoCollapseBorderComponent},
          {path: 'tri-demo-collapse-custom', component: TriDemoCollapseCustomComponent},
          {path: 'tri-demo-collapse-nest', component: TriDemoCollapseNestComponent},
        ]
      }
    ])
  ],
  declarations: [
    DevCollapse,

    TriDemoCollapseAccordionComponent,
    TriDemoCollapseBasicComponent,
    TriDemoCollapseBorderComponent,
    TriDemoCollapseCustomComponent,
    TriDemoCollapseNestComponent,
  ]
})
export class DevCollapseModule {
}
