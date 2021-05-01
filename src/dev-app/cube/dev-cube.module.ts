/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxGanttModule } from '@gradii/cube/gantt';
import { DevCubeComponent } from './dev-cube.component';
import { AppGanttExampleComponent } from './tri-demo-gantt/gantt/gantt.component';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    NgxGanttModule,

    RouterModule.forChild([
      {
        path: '', component: DevCubeComponent, children: [
          {path: 'app-gantt-example-component', component: AppGanttExampleComponent}
        ]
      }
    ])
  ],
  declarations: [
    DevCubeComponent,

    AppGanttExampleComponent
  ]
})
export class DevCubeModule {

}
