import { I18nService as I18n } from '@gradii/triangle/i18n';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  addDays,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  endOfMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  startOfYear
} from 'date-fns';
import {
  DateCellDirective as DateCell,
  DateFullCellDirective as DateFullCell,
  MonthCellDirective as MonthCell,
  MonthFullCellDirective as MonthFullCell
} from './calendar-cells';

@Component({
  selector   : 'tri-calendar',
  templateUrl: './calendar.component.html',
  providers  : [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CalendarComponent), multi: true}
  ]
})
export class CalendarComponent implements ControlValueAccessor, OnInit {
  @Input() mode: 'month' | 'year' = 'month';
  @Output() modeChange: EventEmitter<'month' | 'year'> = new EventEmitter();

  @Input() set value(value: Date) {
    this.updateDate(value, false);
  }

  @Output() valueChange: EventEmitter<Date> = new EventEmitter();

  @Input()
  set dateCell(value: TemplateRef<{ $implicit: Date }>) {
    this._dateCell = value;
  }

  @Input()
  set dateFullCell(value: TemplateRef<{ $implicit: Date }>) {
    this._dateFullCell = value;
  }

  @Input()
  set monthCell(value: TemplateRef<{ $implicit: Date }>) {
    this._monthCell = value;
  }

  @Input()
  set monthFullCell(value: TemplateRef<{ $implicit: Date }>) {
    this._monthFullCell = value;
  }

  @Input()
  set fullscreen(value: boolean) {
    this._fullscreen = coerceBooleanProperty(value);
  }

  get fullscreen(): boolean {
    return this._fullscreen;
  }

  @Input()
  set card(value: boolean) {
    this._fullscreen = !coerceBooleanProperty(value);
  }

  get card(): boolean {
    return !this.fullscreen;
  }

  @ContentChild(DateCell, {read: TemplateRef})
  set dateCellChild(value: TemplateRef<{ $implicit: Date }>) {
    if (value) {
      this._dateCell = value;
    }
  }

  @ContentChild(DateFullCell, {read: TemplateRef})
  set dateFullCellChild(value: TemplateRef<{ $implicit: Date }>) {
    if (value) {
      this._dateFullCell = value;
    }
  }

  @ContentChild(MonthCell, {read: TemplateRef})
  set monthCellChild(value: TemplateRef<{ $implicit: Date }>) {
    if (value) {
      this._monthCell = value;
    }
  }

  @ContentChild(MonthFullCell, {read: TemplateRef})
  set monthFullCellChild(value: TemplateRef<{ $implicit: Date }>) {
    if (value) {
      this._monthFullCell = value;
    }
  }

  @HostBinding('class.tri-fullcalendar--fullscreen')
  _fullscreen = true;

  daysInWeek: DayCellContext[] = [];
  monthsInYear: MonthCellContext[] = [];
  dateMatrix: DateCellContext[][] = [];
  activeDate: Date = new Date();
  currentDateRow: number = -1;
  currentDateCol: number = -1;
  activeDateRow: number = -1;
  activeDateCol: number = -1;
  currentMonthRow: number = -1;
  currentMonthCol: number = -1;
  activeMonthRow: number = -1;
  activeMonthCol: number = -1;
  _dateCell: TemplateRef<{ $implicit: Date }> | null = null;
  _dateFullCell: TemplateRef<{ $implicit: Date }> | null = null;
  _monthCell: TemplateRef<{ $implicit: Date }> | null = null;
  _monthFullCell: TemplateRef<{ $implicit: Date }> | null = null;

  private prefixCls = 'tri-fullcalendar';
  private currentDate = new Date();
  private onChangeFn: (date: Date) => void = () => {
  };
  private onTouchFn: () => void = () => {
  };

  private get calendarStart(): Date {
    return startOfWeek(startOfMonth(this.activeDate));
  }

  constructor(private i18n: I18n) {
  }

  ngOnInit(): void {
    this.setUpDaysInWeek();
    this.setUpMonthsInYear();
    this.setUpDateMatrix();
    this.calculateCurrentDate();
    this.calculateActiveDate();
    this.calculateCurrentMonth();
    this.calculateActiveMonth();
  }

  onModeChange(mode: 'month' | 'year'): void {
    this.modeChange.emit(mode);
  }

  onDateSelect(date: Date, row?, col?): void {
    this.updateDate(date);
  }

  onYearSelect(year: number): void {
    const date = setYear(this.activeDate, year);
    this.updateDate(date);
  }

  onMonthSelect(month: number): void {
    const date = setMonth(this.activeDate, month);
    this.updateDate(date);
  }

  writeValue(value: Date | null): void {
    this.updateDate(value || new Date(), false);
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  private updateDate(date: Date, touched: boolean = true): void {
    const dayChanged = !isSameDay(date, this.activeDate);
    const monthChanged = !isSameMonth(date, this.activeDate);
    const yearChanged = !isSameYear(date, this.activeDate);

    this.activeDate = date;

    if (dayChanged) {
      this.calculateActiveDate();
    }
    if (monthChanged) {
      this.setUpDateMatrix();
      this.calculateCurrentDate();
      this.calculateActiveMonth();
    }
    if (yearChanged) {
      this.calculateCurrentMonth();
    }

    if (touched) {
      this.onChangeFn(date);
      this.onTouchFn();
      this.valueChange.emit(date);
    }
  }

  private setUpDaysInWeek(): void {
    this.daysInWeek = [];
    const weekStart = startOfWeek(this.activeDate);
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const title = this.i18n.formatDate(date, 'E');
      const label = this.i18n.formatDate(date, 'EEEEEE');
      this.daysInWeek.push({title, label});
    }
  }

  private setUpMonthsInYear(): void {
    this.monthsInYear = [];
    for (let i = 0; i < 12; i++) {
      const date = setMonth(this.activeDate, i);
      const title = this.i18n.formatDate(date, 'MMM');
      const label = this.i18n.formatDate(date, 'MMM');
      const start = startOfMonth(date);
      this.monthsInYear.push({title, label, start});
    }
  }

  private setUpDateMatrix(): void {
    this.dateMatrix = [];
    const monthStart = startOfMonth(this.activeDate);
    const monthEnd = endOfMonth(this.activeDate);
    const weekDiff = differenceInCalendarWeeks(monthEnd, monthStart) + 2;

    for (let week = 0; week < weekDiff; week++) {
      const row: DateCellContext[] = [];
      const weekStart = addDays(this.calendarStart, week * 7);

      for (let day = 0; day < 7; day++) {
        const date = addDays(weekStart, day);
        const monthDiff = differenceInCalendarMonths(date, this.activeDate);
        const title = this.i18n.formatDate(date, 'longDate');
        const label = this.i18n.formatDate(date, 'dd');
        const rel = monthDiff === 0 ? 'current' : monthDiff < 0 ? 'last' : 'next';
        row.push({title, label, rel, value: date});
      }
      this.dateMatrix.push(row);
    }
  }

  private calculateCurrentDate(): void {
    if (isSameMonth(this.activeDate, new Date())) {
      this.currentDateRow = differenceInCalendarWeeks(this.currentDate, this.calendarStart);
      this.currentDateCol = differenceInCalendarDays(this.currentDate, addDays(this.calendarStart, this.currentDateRow * 7));
    } else {
      this.currentDateRow = -1;
      this.currentDateCol = -1;
    }
  }

  private calculateActiveDate(): void {
    this.activeDateRow = differenceInCalendarWeeks(this.activeDate, this.calendarStart);
    this.activeDateCol = differenceInCalendarDays(this.activeDate, addDays(this.calendarStart, this.activeDateRow * 7));
  }

  private calculateCurrentMonth(): void {
    if (isSameYear(this.activeDate, new Date())) {
      const yearStart = startOfYear(this.currentDate);
      const monthDiff = differenceInCalendarMonths(this.currentDate, yearStart);
      this.currentMonthRow = Math.floor(monthDiff / 3);
      this.currentMonthCol = monthDiff % 3;
    } else {
      this.currentMonthRow = -1;
      this.currentMonthCol = -1;
    }
  }

  private calculateActiveMonth(): void {
    this.activeMonthRow = Math.floor(this.activeDate.getMonth() / 3);
    this.activeMonthCol = this.activeDate.getMonth() % 3;
  }
}

export interface DayCellContext {
  title: string;
  label: string;
}

export interface MonthCellContext {
  title: string;
  label: string;
  start: Date;
}

export interface DateCellContext {
  title: string;
  label: string;
  rel: 'last' | 'current' | 'next';
  value: Date;
}
