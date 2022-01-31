/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { DIAGRAM_NODE_COMPONENTS, TriDiagramModule } from '@gradii/triangle/diagram';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriSplitterModule } from '@gradii/triangle/splitter';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { CustomNode1Component, CustomNode2Component, CustomNode3Component } from './custom-diagram/custom-node-component';
import { DemoCustomDiagramComponent } from './custom-diagram/demo-custom-diagram.component';
import { DevDiagramComponent } from './dev-diagram.component';
import {
  DemoDiagramDragAndDropComponent
} from './tri-demo-diagram/demo-diagram-drag-and-drop.component';
import { DemoDiagramSettingsComponent } from './tri-demo-diagram/demo-diagram-settings.component';
import { DemoDiagramSimpleComponent } from './tri-demo-diagram/demo-diagram-simple.component';
import { DemoDiagramWorkflowComponent } from './tri-demo-diagram/demo-diagram-workflow.component';

@NgModule({
  imports     : [
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
          },
          {
            path     : 'demo-custom-diagram',
            component: DemoCustomDiagramComponent
          }
        ]
      }
    ]),
    TriButtonModule,
    ObserversModule

  ],
  declarations: [
    DevDiagramComponent,

    DemoDiagramSimpleComponent,
    DemoDiagramWorkflowComponent,
    DemoDiagramDragAndDropComponent,
    DemoDiagramSettingsComponent,
    DemoCustomDiagramComponent,

    CustomNode1Component,
    CustomNode2Component,
    CustomNode3Component,
  ],
  providers: [
    {
      provide : DIAGRAM_NODE_COMPONENTS,
      useValue: {
        type     : 'audit:custom-default1',
        component: CustomNode1Component
      },
      multi   : true
    },
    {
      provide : DIAGRAM_NODE_COMPONENTS,
      useValue: {
        type     : 'audit-person:custom-default2',
        component: CustomNode2Component
      },
      multi   : true
    },
    {
      provide : DIAGRAM_NODE_COMPONENTS,
      useValue: {
        type     : 'audit-department:custom-default3',
        component: CustomNode3Component
      },
      multi   : true
    }
  ]
})
export class DevDiagramModule {

}
