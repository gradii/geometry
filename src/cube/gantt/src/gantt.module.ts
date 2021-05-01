/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGanttBarComponent } from './components/bar/bar.component';

import { GanttCalendarComponent } from './components/calendar/calendar.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttIconComponent } from './components/icon/icon.component';
import { GanttLinksComponent } from './components/links/links.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { NgxGanttRangeComponent } from './components/range/range.component';
import { GanttTableComponent } from './components/table/gantt-table.component';

import { NgxGanttFlatComponent } from './flat/gantt-flat.component';
import { NgxGanttComponent } from './gantt.component';
import {
  IsGanttBarItemPipe,
  IsGanttCustomItemPipe,
  IsGanttRangeItemPipe
} from './gantt.pipe';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';

@NgModule({
  imports: [CommonModule, DragDropModule],
  exports: [
    NgxGanttComponent,
    NgxGanttFlatComponent,
    NgxGanttTableComponent,
    NgxGanttTableColumnComponent,
    NgxGanttRootComponent,
    NgxGanttBarComponent
  ],
  declarations: [
    NgxGanttComponent,
    NgxGanttFlatComponent,
    NgxGanttTableComponent,
    NgxGanttTableColumnComponent,
    GanttTableComponent,
    GanttMainComponent,
    GanttCalendarComponent,
    GanttLinksComponent,
    NgxGanttBarComponent,
    GanttIconComponent,
    GanttDragBackdropComponent,
    NgxGanttRangeComponent,
    NgxGanttRootComponent,
    IsGanttRangeItemPipe,
    IsGanttBarItemPipe,
    IsGanttCustomItemPipe
  ],
  providers: []
})
export class NgxGanttModule {
}
