/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriDndModule } from '@gradii/triangle/dnd/src/dnd.module';
import { BasicComponent } from './basic/basic.component';
import { BatchDragComponent } from './batch-drag/batch-drag.component';
import { CrossDimensionComponent } from './cross-dimension/cross-dimension.component';
import { DevDnd } from './dev-dnd';
import { DropScrollComponent } from './drop-scroll/drop-scroll.component';
import { FollowComponent } from './follow/follow.component';
import { OriginPlaceholderComponent } from './origin-placeholder/origin-placeholder.component';
import { PositionComponent } from './position/position.component';
import { SwitchComponent } from './switch/switch.component';
import { TreeComponent } from './tree/tree.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TriDndModule,
    RouterModule.forChild([
      { path: '',  redirectTo: 'demo' },
      { path: 'demo', component: DevDnd},
    ])
  ],
  exports: [DevDnd],
  declarations: [
    DevDnd,
    BasicComponent,
    TreeComponent,
    FollowComponent,
    PositionComponent,
    SwitchComponent,
    BatchDragComponent,
    OriginPlaceholderComponent,
    DropScrollComponent,
    CrossDimensionComponent
  ],
})
export class DevDndModule {
}
