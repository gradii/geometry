/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriSelectModule } from '@gradii/triangle/select';
import { DevDragAndDropComponent } from './dev-drag-and-drop.component';
import {
  TriDemoDragAndDropChildGroupsWithMonkeyPatchComponent
} from './tri-demo-dnd-child-groups-with-monkey-patch/tri-demo-drag-and-drop-child-groups-with-monkey-patch.component';
import {
  TriDemoDndDragContainerComponent
} from './tri-demo-dnd-drag-container/tri-demo-dnd-drag-container.component';
import {
  TriDemoDndFlexColumnComponent
} from './tri-demo-dnd-flex-column/tri-demo-dnd-flex-column.component';
import {
  TriDemoDndFlexRowComponent
} from './tri-demo-dnd-flex-row/tri-demo-dnd-flex-row.component';
import {
  TriDemoDndGridResizeComponent
} from './tri-demo-dnd-grid-resize/tri-demo-dnd-grid-resize.component';
import { TriDemoDndGridComponent } from './tri-demo-dnd-grid/tri-demo-dnd-grid.component';
import { ListItemComponent } from './tri-demo-dnd-nest/shared/list-item/list-item.component';
import { TriDemoDndNestComponent } from './tri-demo-dnd-nest/tri-demo-dnd-nest.component';
import { TriDemoDndNotCdkComponent } from './tri-demo-dnd-not-cdk/tri-demo-dnd-not-cdk.component';
import {
  TriDemoDndPlaceholderComponent
} from './tri-demo-dnd-placeholder/tri-demo-dnd-placeholder.component';
import {
  TriDemoDndStructureComponent
} from './tri-demo-dnd-structure/tri-demo-dnd-structure.component';

@NgModule({
  imports     : [
    DragDropModule,
    TriDndModule,

    CommonModule,

    TriIconModule,
    FormsModule,
    TriSelectModule,
    TriCheckboxModule,

    RouterModule.forChild([
      {
        path: '', component: DevDragAndDropComponent, children: [
          {path: 'tri-demo-dnd-nest', component: TriDemoDndNestComponent},
          {path: 'tri-demo-dnd-structure', component: TriDemoDndStructureComponent},
          {
            path     : 'tri-demo-dnd-child-groups-with-monkey-patch',
            component: TriDemoDragAndDropChildGroupsWithMonkeyPatchComponent
          },
          {path: 'tri-demo-drag-and-no-cdk', component: TriDemoDndNotCdkComponent},
          {path: 'tri-demo-drag-placeholder', component: TriDemoDndPlaceholderComponent},
          {path: 'tri-demo-drag-flex-row', component: TriDemoDndFlexRowComponent},
          {path: 'tri-demo-drag-flex-column', component: TriDemoDndFlexColumnComponent},
          {path: 'tri-demo-drag-grid', component: TriDemoDndGridComponent},
          {path: 'tri-demo-drag-grid-resize', component: TriDemoDndGridResizeComponent},
          {path: 'tri-demo-drag-drag-container', component: TriDemoDndDragContainerComponent},
        ]
      }
    ]),

  ],
  declarations: [
    DevDragAndDropComponent,
    ListItemComponent,

    TriDemoDndNestComponent,
    TriDemoDndStructureComponent,
    TriDemoDragAndDropChildGroupsWithMonkeyPatchComponent,
    TriDemoDndNotCdkComponent,
    TriDemoDndPlaceholderComponent,
    TriDemoDndFlexRowComponent,
    TriDemoDndFlexColumnComponent,
    TriDemoDndGridComponent,
    TriDemoDndGridResizeComponent,
    TriDemoDndDragContainerComponent
  ]
})
export class DevDragAndDropModule {

}
