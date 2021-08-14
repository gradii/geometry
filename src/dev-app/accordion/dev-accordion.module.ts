/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriAccordionModule } from '@gradii/triangle/accordion';
import { TriSelectModule } from '@gradii/triangle/select';
import { DevAccordion } from './dev-accordion';
import { TriDemoAccordionAccordionComponent } from './tri-demo-accordion/tri-demo-accordion-accordion.component';
import { TriDemoAccordionBasicComponent } from './tri-demo-accordion/tri-demo-accordion-basic.component';
import { TriDemoAccordionBorderComponent } from './tri-demo-accordion/tri-demo-accordion-border.component';
import { TriDemoAccordionCustomComponent } from './tri-demo-accordion/tri-demo-accordion-custom.component';
import { TriDemoAccordionNestComponent } from './tri-demo-accordion/tri-demo-accordion-nest.component';
import { TriDemoAccordionSizeComponent } from './tri-demo-accordion/tri-demo-accordion-size.component';


@NgModule({
  imports: [
    CommonModule,
    TriAccordionModule,

    RouterModule.forChild([
      {
        path: '', component: DevAccordion, children: [
          {path: 'tri-demo-accordion-accordion', component: TriDemoAccordionAccordionComponent},
          {path: 'tri-demo-accordion-basic', component: TriDemoAccordionBasicComponent},
          {path: 'tri-demo-accordion-border', component: TriDemoAccordionBorderComponent},
          {path: 'tri-demo-accordion-custom', component: TriDemoAccordionCustomComponent},
          {path: 'tri-demo-accordion-nest', component: TriDemoAccordionNestComponent},
          {path: 'tri-demo-accordion-size', component: TriDemoAccordionSizeComponent},
        ]
      }
    ]),
    TriSelectModule,
    FormsModule
  ],
  declarations: [
    DevAccordion,

    TriDemoAccordionAccordionComponent,
    TriDemoAccordionBasicComponent,
    TriDemoAccordionBorderComponent,
    TriDemoAccordionCustomComponent,
    TriDemoAccordionNestComponent,
    TriDemoAccordionSizeComponent
  ]
})
export class DevAccordionModule {
}
