/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SplitterDemoBasicComponent } from './basic/splitter-demo-basic.component';
import { SplitterDemoDirectionComponent } from './direction/splitter-demo-direction.component';
import { SplitterDemoMultiComponent } from './multi/splitter-demo-multi.component';
import { SplitterDemoMenuFoldComponent } from './shrink/shrink.component';
import { SplitterDemoComponent } from './dev-splitter.component';
import { SplitterDemoVerticalComponent } from './vertical/splitter-demo-vertical.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    
    RouterModule.forChild([
      {path: '', redirectTo: 'demo'},
      {path: 'demo', component: SplitterDemoComponent},
    ])
  ],
  exports: [SplitterDemoComponent],
  declarations: [
    SplitterDemoComponent,
    SplitterDemoBasicComponent,
    SplitterDemoVerticalComponent,
    SplitterDemoMultiComponent,
    SplitterDemoDirectionComponent,
    SplitterDemoMenuFoldComponent
  ],
})
export class SplitterDemoModule {
}
