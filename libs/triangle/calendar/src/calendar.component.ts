import { Component, ContentChild, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';

import * as moment from 'moment';
import { Moment } from 'moment';
import 'moment/locale/zh-cn';

export interface MonthInterface {
  index: number;
  name: string;
  year: number;
  isCurrentMonth: boolean;
  isSelectedMonth: boolean;
}

export type QuartersType = Array<MonthInterface>;

export interface DayInterface {
  number: number;
  isLastMonth: boolean;
  isNextMonth: boolean;
  isCurrentDay: boolean;
  isSelectedDay: boolean;
  title: string;
  date: Moment;
  disabled: boolean;
  firstDisabled: boolean;
  lastDisabled: boolean;
}

export interface WeekInterface {
  days: Array<DayInterface>;
}

@Component({
  selector     : 'tri-calendar',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div
      [class.tri-fullcalendar-fullscreen]="fullScreen"
      [class.tri-patch-full-height]="datePicker">
      <div class="ant-fullcalendar-header" *ngIf="showHeader">
        <tri-select
          class="ant-fullcalendar-year-select" style="width: 75px;"
          [ngModel]="_showYear"
          (ngModelChange)="_showYear = $event;_buildCalendar()">
          <tri-option
            *ngFor="let year of _listOfYearName"
            [label]="year"
            [value]="year">
          </tri-option>
        </tri-select>
        <tri-select
          class="ant-fullcalendar-month-select"
          style="width: 70px;"
          *ngIf="mode == 'year'"
          [ngModel]="_showMonth"
          (ngModelChange)="_showMonth = $event;_buildCalendar()">
          <tri-option
            *ngFor="let _month of _listOfMonthName;let i = index;"
            [label]="_month"
            [value]="i">
          </tri-option>
        </tri-select>
        <tri-radio-group [(ngModel)]="mode">
          <label tri-radio-button [value]="'year'">
            <span>{{_yearUnit}}</span>
          </label><label tri-radio-button [value]="'month'">
          <span>{{_monthUnit}}</span>
        </label>
        </tri-radio-group>
      </div>
      <div
        [class.tri-fullcalendar-fullscreen]="fullScreen"
        [class.tri-fullcalendar]="!datePicker"
        [class.tri-fullcalendar-full]="!datePicker"
        [class.tri-patch-full-height]="datePicker">
        <div
          [class.tri-fullcalendar-calendar-body]="!datePicker"
          [class.tri-calendar-body]="!datePicker"
          [class.tri-patch-full-height]="datePicker">
          <table
            [class.tri-fullcalendar-table]="!datePicker"
            [class.tri-calendar-table]="datePicker"
            [class.tri-patch-full-height]="datePicker"
            *ngIf="mode == 'year'">
            <thead>
            <tr>
              <th
                *ngFor="let _min of _listOfWeekName"
                [class.tri-fullcalendar-column-header]="!datePicker"
                [class.tri-calendar-column-header]="datePicker">
                <span class="ant-fullcalendar-column-header-inner">{{_min}}</span>
              </th>
            </tr>
            </thead>
            <tbody
              [class.tri-fullcalendartbody]="!datePicker"
              [class.tri-calendartbody]="datePicker">
            <tr *ngFor="let week of _weeksCalendar">
              <ng-template [ngIf]="!datePicker">
                <td
                  [attr.title]="day.title"
                  *ngFor="let day of week.days"
                  [class.tri-fullcalendar-cell]="!datePicker"
                  [class.tri-calendar-cell]="datePicker"
                  [class.tri-fullcalendar-last-month-cell]="day.isLastMonth"
                  [class.tri-fullcalendar-next-month-btn-day]="day.isNextMonth"
                  [class.tri-fullcalendar-selected-day]="day.isSelectedDay"
                  [class.tri-fullcalendar-today]="day.isCurrentDay">
                  <div class="ant-fullcalendar-date">
                    <div class="ant-fullcalendar-value" (click)="_clickDay($event,day)">{{day.number}}</div>
                    <div class="ant-fullcalendar-content">
                      <ng-template
                        *ngIf="dateCell"
                        [ngTemplateOutlet]="dateCell"
                        [ngTemplateOutletContext]="{ $implicit: day}">
                      </ng-template>
                    </div>
                  </div>
                </td>
              </ng-template>
              <ng-template [ngIf]="datePicker">
                <td
                  [attr.title]="day.title"
                  *ngFor="let day of week.days"
                  class="ant-calendar-cell"
                  [class.tri-calendar-disabled-cell-first-of-row]="day.firstDisabled"
                  [class.tri-calendar-disabled-cell-last-of-row]="day.lastDisabled"
                  [class.tri-calendar-disabled-cell]="day.disabled"
                  [class.tri-calendar-last-month-cell]="day.isLastMonth"
                  [class.tri-calendar-next-month-btn-day]="day.isNextMonth"
                  [class.tri-calendar-selected-day]="day.isSelectedDay"
                  [class.tri-calendar-today]="day.isCurrentDay">
                  <div class="ant-calendar-date" (click)="_clickDay($event,day)">{{day.number}}</div>
                </td>
              </ng-template>
            </tr>
            </tbody>
          </table>
          <table
            [class.tri-fullcalendar-month-panel-table]="!datePicker"
            [class.tri-calendar-month-panel-table]="datePicker"
            *ngIf="mode == 'month'">
            <tbody class="ant-fullcalendar-month-panel-tbody">
            <tr *ngFor="let quarter of _quartersCalendar">
              <ng-template [ngIf]="!datePicker">
                <td
                  *ngFor="let month of quarter"
                  [attr.title]="month.name"
                  class="ant-fullcalendar-month-panel-cell"
                  [class.tri-fullcalendar-month-panel-selected-cell]="month.isSelectedMonth"
                  [class.tri-fullcalendar-month-panel-current-cell]="month.isCurrentMonth">
                  <div class="ant-fullcalendar-month">
                    <div class="ant-fullcalendar-value" (click)="_clickMonth($event,month)">{{month.name}}</div>
                    <div class="ant-fullcalendar-content">
                      <ng-template
                        *ngIf="monthCell"
                        [ngTemplateOutlet]="monthCell"
                        [ngTemplateOutletContext]="{ $implicit: month}">
                      </ng-template>
                    </div>
                  </div>
                </td>
              </ng-template>
              <ng-template [ngIf]="datePicker">
                <td
                  *ngFor="let month of quarter"
                  [attr.title]="month.name"
                  class="ant-calendar-month-panel-cell"
                  [class.tri-calendar-month-panel-selected-cell]="month.isSelectedMonth"
                  [class.tri-calendar-month-panel-current-cell]="month.isCurrentMonth">
                  <div class="ant-calendar-month-panel-month" (click)="_clickMonth($event,month)">
                    {{month.name}}
                  </div>
                </td>
              </ng-template>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`
})
export class CalendarComponent implements OnInit {
  _el: HTMLElement;
  _weeksCalendar: Array<WeekInterface> = [];
  _quartersCalendar: Array<QuartersType> = [];
  _listOfWeekName: Array<string> = [];
  _listOfMonthName: Array<string> = [];
  _listOfYearName: Array<string> = [];
  _yearUnit = '年';
  _monthUnit = '月';
  _showMonth = moment(new Date()).month();
  _showYear = moment(new Date()).year();
  _value: Date = new Date();
  _locale = 'zh-cn';
  @ContentChild('dateCell') dateCell: TemplateRef<any>;
  @ContentChild('monthCell') monthCell: TemplateRef<any>;

  @Output() clickDay: EventEmitter<any> = new EventEmitter();
  @Output() clickMonth: EventEmitter<any> = new EventEmitter();
  @Input() clearTime = true;
  @Input()
  @HostBinding('class.tri-patch-full-height')
  datePicker = false;
  @Input() mode = 'year';
  @Input() fullScreen = true;
  @Input() showHeader = true;
  @Input() disabledDate: Function;

  /**
   * Get the date value
   * 获取展示日期
   * @default {Date} 当前日期
   */
  @Input()
  get value(): Date {
    return this._value || new Date();
  }

  /**
   * Set date value
   * 设置展示日期
   * @param  value
   */
  set value(value: Date) {
    if (this._value === value) {
      return;
    }
    this._value = value || new Date();
    this._showMonth = moment(this._value).month();
    this._showYear = moment(this._value).year();
    this._buildCalendar();
  }

  /**
   * Show year
   * 获取展示年份
   */
  @Input()
  get showYear() {
    return this._showYear;
  }

  /**
   * Set show year
   * 设置展示年份
   * @param value
   */
  set showYear(value) {
    this._showYear = value;
    this._buildCalendar();
  }

  /**
   * Get show month
   * 获取展示月份
   */
  @Input()
  get showMonth() {
    return this._showMonth;
  }

  /**
   * Set show month
   * 设置展示月份
   * @param value
   */
  set showMonth(value) {
    this._showMonth = value;
    this._buildCalendar();
  }

  /**
   * Get locale
   * 获取时区/地区
   */
  @Input()
  get locale(): string {
    return this._locale;
  }

  /**
   * Set locale
   * 设置时区、语言等, 默认支持 en, zh-cn
   * @param  value
   */
  set locale(value: string) {
    this._locale = value;
    moment.locale(this._locale);
  }

  _removeTime(date) {
    if (this.clearTime) {
      return date
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
    } else {
      return date;
    }
  }

  _clickDay($event, day) {
    $event.preventDefault();
    $event.stopPropagation();
    if (day.disabled) {
      return;
    }
    this.clickDay.emit(day);
  }

  _clickMonth($event, month) {
    $event.preventDefault();
    $event.stopPropagation();
    this.clickMonth.emit(month);
  }

  _buildMonth(d: Moment): Array<WeekInterface> {
    const weeks: Array<WeekInterface> = [];
    const _rawDate = this._removeTime(d);
    const start = _rawDate
      .clone()
      .date(1)
      .day(0);
    const month = _rawDate.clone();
    let done = false;
    const date = start.clone();
    let monthIndex = date.month();
    let count = 0;
    while (!done) {
      weeks.push({days: this._buildWeek(date.clone(), month)});
      date.add(1, 'w');
      done = count++ > 4;
      monthIndex = date.month();
    }
    return weeks;
  }

  _buildWeek(date: Moment, month: Moment): Array<DayInterface> {
    const days: Array<DayInterface> = [];
    for (let i = 0; i < 7; i++) {
      days.push({
        number       : date.date(),
        isLastMonth  : date.month() < month.month(),
        isNextMonth  : date.month() > month.month(),
        isCurrentDay : date.isSame(new Date(), 'day'),
        isSelectedDay: date.isSame(this.value, 'day'),
        title        : date.format('YYYY-MM-DD'),
        date         : date,
        disabled     : this.disabledDate && this.disabledDate(date.toDate()),
        firstDisabled:
        this.disabledDate &&
        this.disabledDate(date.toDate()) &&
        (date.day() === 0 ||
          (date.day() !== 0 &&
            this.disabledDate &&
            !this.disabledDate(
              date
                .clone()
                .subtract(1, 'day')
                .toDate()
            ))),
        lastDisabled :
        this.disabledDate &&
        this.disabledDate(date.toDate()) &&
        (date.day() === 6 ||
          (date.day() !== 6 &&
            this.disabledDate &&
            !this.disabledDate(
              date
                .clone()
                .add(1, 'day')
                .toDate()
            )))
      });
      date = date.clone();
      date.add(1, 'd');
    }
    return days;
  }

  _buildYears(date: Moment) {
    const quarters = [];
    let months: Array<MonthInterface> = [];
    for (let i = 0; i < 12; i++) {
      months.push({
        index          : i,
        name           : this._listOfMonthName[i],
        year           : date.year(),
        isCurrentMonth : moment(new Date()).month() === i && date.isSame(new Date(), 'year'),
        isSelectedMonth: this._showMonth === i
      });
      if ((i + 1) % 3 === 0) {
        quarters.push(months);
        months = [];
      }
    }
    return quarters;
  }

  _buildCalendar() {
    moment.locale(this._locale);
    /** TODO replace with real i18n*/
    if (this._locale !== 'zh-cn') {
      try {
        this._yearUnit =
          moment
            .duration(12, 'month')
            .humanize()
            .split(' ')[1][0]
            .toUpperCase() +
          moment
            .duration(12, 'month')
            .humanize()
            .split(' ')[1]
            .slice(
              1,
              moment
                .duration(12, 'month')
                .humanize()
                .split(' ')[1].length
            );
        this._monthUnit =
          moment
            .duration(4, 'week')
            .humanize()
            .split(' ')[1][0]
            .toUpperCase() +
          moment
            .duration(4, 'week')
            .humanize()
            .split(' ')[1]
            .slice(
              1,
              moment
                .duration(4, 'week')
                .humanize()
                .split(' ')[1].length
            );
      } catch (e) {}
    }
    this._listOfYearName = this._generateYears(this._showYear);
    this._listOfWeekName = moment.weekdaysMin();
    this._listOfMonthName = moment.months();
    const date = moment(this.value)
      .year(this._showYear)
      .month(this._showMonth);
    this._weeksCalendar = this._buildMonth(date);
    this._quartersCalendar = this._buildYears(date);
  }

  _generateYears(year) {
    const listOfYears = [];
    for (const i of Array.from(Array(20).keys())) {
      listOfYears.push(i - 10 + year);
    }
    return listOfYears;
  }

  constructor(private _elementRef: ElementRef) {
    this._el = this._elementRef.nativeElement;
  }

  ngOnInit() {
    this._buildCalendar();
  }
}
