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


@NgModule({
  imports     : [
    CommonModule,
    TriCollapseModule,

    RouterModule.forChild([
      {
        path: '', component: DevCollapse, children: [
          {path: 'tri-demo-collapse-accordion', component: TriDemoCollapseAccordionComponent}
        ]
      }
    ])
  ],
  declarations: [
    DevCollapse,

    TriDemoCollapseAccordionComponent
  ]
})
export class DevCollapseModule {
}
