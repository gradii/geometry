/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriIconModule } from '@gradii/triangle/icon';
import { DevDragAndDropComponent } from './dev-drag-and-drop.component';
import { ListItemComponent } from './tri-demo-dnd-nest/shared/list-item/list-item.component';
import { TriDemoDndNestComponent } from './tri-demo-dnd-nest/tri-demo-dnd-nest.component';
import { TriDemoDndStructureComponent } from './tri-demo-dnd-structure/tri-demo-dnd-structure.component';
import { TriDemoDragAndDropChildGroupsWithMonkeyPatchComponent } from './tri-demo-drag-and-drop-child-groups-with-monkey-patch/tri-demo-drag-and-drop-child-groups-with-monkey-patch.component'

@NgModule({
  imports     : [
    DragDropModule,

    CommonModule,

    TriIconModule,

    RouterModule.forChild([
      {
        path: '', component: DevDragAndDropComponent, children: [
          {path: 'tri-demo-dnd-nest', component: TriDemoDndNestComponent},
          {path: 'tri-demo-dnd-structure', component: TriDemoDndStructureComponent},
          {path: 'tri-demo-drag-and-drop-child-groups-with-monkey-patch', component: TriDemoDragAndDropChildGroupsWithMonkeyPatchComponent},
        ]
      }
    ])
  ],
  declarations: [
    DevDragAndDropComponent,
    ListItemComponent,

    TriDemoDndNestComponent,
    TriDemoDndStructureComponent,
    TriDemoDragAndDropChildGroupsWithMonkeyPatchComponent
  ]
})
export class DevDragAndDropModule {

}
