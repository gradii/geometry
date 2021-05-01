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
import { AppGanttFlatExampleComponent } from './tri-demo-gantt/gantt-flat/flat.component';
import { AppGanttRangeExampleComponent } from './tri-demo-gantt/gantt-range/gantt-range.component';
import { AppGanttExampleComponent } from './tri-demo-gantt/gantt/gantt.component';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    NgxGanttModule,

    RouterModule.forChild([
      {
        path: '', component: DevCubeComponent, children: [
          {path: 'app-gantt-basic-example-component', component: AppGanttExampleComponent},
          {path: 'app-gantt-flat-example-component', component: AppGanttFlatExampleComponent},
          {path: 'app-gantt-range-example-component', component: AppGanttRangeExampleComponent},
        ]
      }
    ])
  ],
  declarations: [
    DevCubeComponent,

    AppGanttExampleComponent,
    AppGanttFlatExampleComponent,
    AppGanttRangeExampleComponent
  ]
})
export class DevCubeModule {

}
