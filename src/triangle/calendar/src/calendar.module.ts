import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriI18nModule } from '@gradii/triangle/i18n';
import { TriRadioModule, TriSelectModule } from '@gradii/triangle/inputs';
import {
  DateCellDirective,
  DateFullCellDirective,
  MonthCellDirective,
  MonthFullCellDirective
} from './calendar-cells';
import { CalendarHeaderComponent } from './calendar-header.component';
import { CalendarComponent } from './calendar.component';

@NgModule({
  declarations: [
    CalendarHeaderComponent,
    CalendarComponent,
    DateCellDirective,
    DateFullCellDirective,
    MonthCellDirective,
    MonthFullCellDirective
  ],
  exports     : [
    CalendarComponent,
    DateCellDirective,
    DateFullCellDirective,
    MonthCellDirective,
    MonthFullCellDirective
  ],
  imports     : [CommonModule, FormsModule, TriI18nModule, TriRadioModule, TriSelectModule]
})
export class TriCalendarModule {}