/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriDiagramModule } from '@gradii/triangle/diagram';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriSplitterModule } from '@gradii/triangle/splitter';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { DevDiagramComponent } from './dev-diagram.component';
import { DemoDiagramDragAndDropComponent } from './tri-demo-diagram/demo-diagram-drag-and-drop.component';
import { DemoDiagramSettingsComponent } from './tri-demo-diagram/demo-diagram-settings.component';
import { DemoDiagramSimpleComponent } from './tri-demo-diagram/demo-diagram-simple.component';
import { DemoDiagramWorkflowComponent } from './tri-demo-diagram/demo-diagram-workflow.component';

@NgModule({
  imports: [
    CommonModule,

    TriSplitterModule,
    TriDiagramModule,
    TriTabsModule,
    TriDndModule,
    TriButtonModule,

    RouterModule.forChild([
      {
        path: '', component: DevDiagramComponent, children: [
          {
            path     : 'tri-demo-diagram-simple-component',
            component: DemoDiagramSimpleComponent
          },
          {
            path     : 'tri-demo-diagram-drag-and-drop-component',
            component: DemoDiagramDragAndDropComponent
          },
          {
            path     : 'tri-demo-diagram-workflow-component',
            component: DemoDiagramWorkflowComponent
          },
          {
            path     : 'tri-demo-diagram-settings-component',
            component: DemoDiagramSettingsComponent
          }
        ]
      }
    ]),
    TriButtonModule,

  ],
  declarations: [
    DevDiagramComponent,

    DemoDiagramSimpleComponent,
    DemoDiagramWorkflowComponent,
    DemoDiagramDragAndDropComponent,
    DemoDiagramSettingsComponent
  ]
})
export class DevDiagramModule {

}
