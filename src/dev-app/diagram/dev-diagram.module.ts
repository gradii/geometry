/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriDiagramModule } from '@gradii/triangle/diagram';
import { DevDiagramComponent } from './dev-diagram.component';
import { DemoDiagramSimpleComponent } from './tri-demo-diagram/demo-diagram-simple.component';
import { DemoDiagramDragAndDropComponent } from './tri-demo-diagram/demo-diagram-drag-and-drop.component';

@NgModule({
  imports     : [
    CommonModule,

    TriDiagramModule,

    RouterModule.forChild([
      {
        path: '', component: DevDiagramComponent, children: [
          {
            path: 'tri-demo-diagram-simple-component', component: DemoDiagramSimpleComponent
          },
          {
            path: 'tri-demo-diagram-drag-and-drop-component', component: DemoDiagramDragAndDropComponent
          }
        ]
      }
    ])
  ],
  declarations: [
    DevDiagramComponent,

    DemoDiagramSimpleComponent,
    DemoDiagramDragAndDropComponent
  ]
})
export class DevDiagramModule {

}
