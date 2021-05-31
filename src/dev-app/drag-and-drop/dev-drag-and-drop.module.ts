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

@NgModule({
  imports     : [
    DragDropModule,

    CommonModule,

    TriIconModule,

    RouterModule.forChild([
      {
        path: '', component: DevDragAndDropComponent, children: [
          {path: 'tri-demo-dnd-nest', component: TriDemoDndNestComponent}
        ]
      }
    ])
  ],
  declarations: [
    DevDragAndDropComponent,
    ListItemComponent,

    TriDemoDndNestComponent
  ]
})
export class DevDragAndDropModule {

}
