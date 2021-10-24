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
import { TriSplitterModule } from '@gradii/triangle/splitter';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { DevSplitter } from './dev-splitter';
import { SplitterDemoBasicComponent } from './tri-demo-splitter/basic/splitter-demo-basic.component';
import { SplitterDemoDirectionComponent } from './tri-demo-splitter/direction/splitter-demo-direction.component';
import { SplitterDemoMultiComponent } from './tri-demo-splitter/multi/splitter-demo-multi.component';
import { SplitterDemoMenuFoldComponent } from './tri-demo-splitter/shrink/shrink.component';
import { SplitterDemoVerticalComponent } from './tri-demo-splitter/vertical/splitter-demo-vertical.component';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    RouterModule.forChild([
      {
        path: '', component: DevSplitter, children: [
          {path: 'tri-demo-splitter-basic', component: SplitterDemoBasicComponent},
          {path: 'tri-demo-splitter-direction', component: SplitterDemoDirectionComponent},
          {path: 'tri-demo-splitter-multi', component: SplitterDemoMultiComponent},
          {path: 'tri-demo-splitter-shrink', component: SplitterDemoMenuFoldComponent},
          {path: 'tri-demo-splitter-vertical', component: SplitterDemoVerticalComponent},
        ]
      },
    ]),

    TriSplitterModule,
    TriTooltipModule,
    TriAccordionModule
  ],
  exports     : [DevSplitter],
  declarations: [
    DevSplitter,
    SplitterDemoBasicComponent,
    SplitterDemoVerticalComponent,
    SplitterDemoMultiComponent,
    SplitterDemoDirectionComponent,
    SplitterDemoMenuFoldComponent
  ],
})
export class DevSplitterModule {
}
