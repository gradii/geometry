/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriListModule } from '@gradii/triangle/list';
import { DevListComponent } from './dev-list.component';
import { TriDemoListBasicComponent } from './tri-demo-list/tri-demo-list-basic.component';

@NgModule({
  imports     : [
    CommonModule,

    TriListModule,

    RouterModule.forChild([
      {
        path: '', component: DevListComponent, children: [
          {path: 'tri-demo-list-basic', component: TriDemoListBasicComponent}
        ]
      }
    ])
  ],
  declarations: [
    DevListComponent,
 
    TriDemoListBasicComponent
  ]
})
export class DevListModule {

}
