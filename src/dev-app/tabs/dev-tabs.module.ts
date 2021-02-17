/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { DevTabsComponent } from './dev-tabs.component';
import { TriDemoTabsBasicComponent } from './tri-demo-tabs/tri-demo-tabs-basic.component';

@NgModule({
  imports     : [
    CommonModule,
    TriTabsModule,

    RouterModule.forChild([
      {
        path: '', component: DevTabsComponent, children: [
          {path: 'tri-demo-tabs-basic', component: TriDemoTabsBasicComponent}
        ]
      }
    ])
  ],
  declarations: [
    DevTabsComponent,

    TriDemoTabsBasicComponent
  ]
})
export class DevTabsModule {

}