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
import { TriDemoDiagramSimpleComponent } from './tri-demo-diagram/demo-diagram-simple.component';

@NgModule({
  imports     : [
    CommonModule,

    TriDiagramModule,

    RouterModule.forChild([
      {
        path: '', component: DevDiagramComponent, children: [
          {
            path: 'tri-demo-diagram-simple-component', component: TriDemoDiagramSimpleComponent
          }
        ]
      }
    ])
  ],
  declarations: [
    DevDiagramComponent,

    TriDemoDiagramSimpleComponent
  ]
})
export class DevDiagramModule {

}
