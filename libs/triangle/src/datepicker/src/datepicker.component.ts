import {
  Component,
  ViewEncapsulation,
  Input,
  ElementRef,
  forwardRef,
  ChangeDetectorRef,
  ViewChild,
  HostBinding,
  OnInit
} from '@angular/core';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropDownAnimation } from '@gradii/triangle/core';
import { TimePickerInnerComponent } from '@gradii/triangle/time-picker';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { DEFAULT_DATEPICKER_POSITIONS } from '@gradii/triangle/core';

@Component({
  selector: 'tri-datepicker',
  encapsulation: ViewEncapsulation.None,
  animations: [DropDownAnimation],
  template: `
    <span style="display: block"
          (click)="_openCalendar()"
          cdkOverlayOrigin
          #origin="cdkOverlayOrigin"
          #trigger>
      <input
        tri-input
        (blur)="onTouched()"
        [attr.placeholder]="placeHolder"
        [disabled]="disabled"
        [size]="size"
        class="ant-calendar-picker-input"
        [value]="_value|triDate:format">
      <i class="ant-calendar-picker-clear anticon anticon-cross-circle"
         *ngIf="_showClearIcon"
         (click)="onTouched();_clearValue($event)">
      </i>
      <span class="ant-calendar-picker-icon"></span>
    </span>
    <ng-template
      cdkConnectedOverlay
      cdkConnectedOverlayHasBackdrop
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOrigin]="origin"
      (backdropClick)="_closeCalendar()"
      (detach)="_closeCalendar()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayOpen]="_open">
      <div class="ant-calendar-picker-container"
           [class.top]="_dropDownPosition==='top'"
           [class.bottom]="_dropDownPosition==='bottom'"
           [@dropDownAnimation]="_dropDownPosition">
        <div class="ant-calendar" tabindex="0" [class.ant-calendar-time]="showTime">
          <div class="ant-calendar-input-wrap">
            <div class="ant-calendar-date-input-wrap">
              <input class="ant-calendar-input"
                     [attr.placeholder]="placeHolder"
                     [value]="_value|triDate:format"
                     #dateBox
                     (blur)="_blurInput(dateBox)">
            </div>
            <a class="ant-calendar-clear-btn" title="清除"></a>
          </div>
          <div class="ant-calendar-date-panel">
            <div class="ant-calendar-header">
              <div style="position: relative;" *ngIf="_mode!='time'">
                <a class="ant-calendar-prev-year-btn" title="上一年" (click)="_preYear()"></a>
                <a class="ant-calendar-prev-month-btn" title="上个月" (click)="_preMonth()"></a>
                <span class="ant-calendar-ym-select">
                <a class="ant-calendar-month-select" title="选择月份" (click)="_changeMonthView()">{{_showMonth + 1}}月</a>
                <a class="ant-calendar-year-select" title="选择年份" (click)="_changeDecadeView($event)">{{_showYear}}年</a>
                </span>
                <a class="ant-calendar-next-month-btn" title="下个月" (click)="_nextMonth()"></a>
                <a class="ant-calendar-next-year-btn" title="下一年" (click)="_nextYear()"></a>
              </div>
              <div style="position: relative;" *ngIf="_mode=='time'">
                <span class="ant-calendar-my-select">
                  <a class="ant-calendar-year-select" title="Choose a month">{{_selectedYear}}年</a>
                  <a class="ant-calendar-month-select" title="Choose a month">{{_showMonth + 1}}月</a>
                  <a class="ant-calendar-day-select">{{_selectedDate}}日</a>
                </span>
              </div>
              <div class="ant-calendar-month-panel" *ngIf="_mode=='month'">
                <div>
                  <div class="ant-calendar-month-panel-header">
                    <a class="ant-calendar-month-panel-prev-year-btn" title="上一年" (click)="_preYear()"></a>
                    <a class="ant-calendar-month-panel-year-select" title="选择年份" (click)="_changeDecadeView($event)">
                      <span class="ant-calendar-month-panel-year-select-content">{{_showYear}}</span>
                      <span class="ant-calendar-month-panel-year-select-arrow">x</span>
                    </a>
                    <a class="ant-calendar-month-panel-next-year-btn" title="下一年" (click)="_nextYear()"></a>
                  </div>
                  <div class="ant-calendar-month-panel-body">
                    <tri-calendar
                      [clearTime]="!showTime"
                      [disabledDate]="disabledDate"
                      (clickDay)="_clickDay($event)"
                      [showMonth]="_showMonth"
                      [showYear]="_showYear"
                      [value]="_value"
                      (clickMonth)="_clickMonth($event)"
                      [mode]="'month'"
                      [fullScreen]="false"
                      [showHeader]="false"
                      [datePicker]="true">
                    </tri-calendar>
                  </div>
                </div>
              </div>
              <div class="ant-calendar-year-panel" *ngIf="_mode=='decade'">
                <div>
                  <div class="ant-calendar-year-panel-header">
                    <a class="ant-calendar-year-panel-prev-decade-btn" title="上一年代" (click)="_preDecade()"></a>
                    <a class="ant-calendar-year-panel-decade-select" title="选择年代">
                      <span
                        class="ant-calendar-year-panel-decade-select-content">{{_startDecade}}-{{_startDecade + 9}}</span>
                      <span class="ant-calendar-year-panel-decade-select-arrow">x</span>
                    </a>
                    <a class="ant-calendar-year-panel-next-decade-btn" title="下一年代" (click)="_nextDecade()"></a>
                  </div>
                  <div class="ant-calendar-year-panel-body">
                    <table class="ant-calendar-year-panel-table" cellspacing="0" role="grid">
                      <tbody class="ant-calendar-year-panel-tbody">
                      <tr *ngFor="let tr of _yearPanel">
                        <ng-template ngFor let-td [ngForOf]="tr">
                          <td class="ant-calendar-year-panel-cell ant-calendar-year-panel-last-decade-cell"
                              *ngIf="td=='start'">
                            <a class="ant-calendar-year-panel-year" (click)="_preDecade()">{{_startDecade - 1}}</a>
                          </td>
                          <td *ngIf="(td!='start')&&(td!='end')" [attr.title]="_startDecade+td"
                              class="ant-calendar-year-panel-cell"
                              [ngClass]="{'ant-calendar-year-panel-selected-cell':(_startDecade+td==_showYear)}">
                            <a class="ant-calendar-year-panel-year"
                               (click)="_setShowYear(_startDecade+td,$event)">{{_startDecade + td}}</a>
                          </td>
                          <td class="ant-calendar-year-panel-cell ant-calendar-year-panel-next-decade-cell"
                              *ngIf="td=='end'">
                            <a class="ant-calendar-year-panel-year" (click)="_nextDecade()">{{_startDecade + 10}}</a>
                          </td>
                        </ng-template>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <tri-timepicker-inner
              [placeHolder]="showTime&&showTime.placeHolder||'请选择时间'"
              [format]="showTime&&showTime.format||'HH:mm:ss'"
              [disabled]="showTime&&showTime.disabled||false"
              [disabledHours]="showTime&&showTime.disabledHours||null"
              [disabledMinutes]="showTime&&showTime.disabledMinutes||null"
              [disabledSeconds]="showTime&&showTime.disabledSeconds||null"
              [hideDisabledOptions]="showTime&&showTime.hideDisabledOptions||false"
              [ngModel]="_value"
              (ngModelChange)="_changeTime($event)"
              *ngIf="showTime&&(_mode == 'time')"></tri-timepicker-inner>
            <div class="ant-calendar-calendar-body">
              <tri-calendar [clearTime]="!showTime"
                            [disabledDate]="disabledDate"
                            (clickDay)="_clickDay($event)"
                            [showMonth]="_showMonth"
                            [showYear]="_showYear"
                            [value]="_value"
                            (clickMonth)="_clickMonth($event)"
                            [mode]="'year'"
                            [fullScreen]="false"
                            [showHeader]="false"
                            [datePicker]="true"></tri-calendar>
            </div>
            <div class="ant-calendar-footer ant-calendar-footer-show-ok">
                <span class="ant-calendar-footer-btn">
                  <a class="ant-calendar-today-btn " [attr.title]="_today|triDate:format"
                     (click)="_changeToToday()">{{showTime ? '此刻' : '今天'}}</a>
                  <a class="ant-calendar-time-picker-btn" (click)="_changeTimeView($event)"
                     *ngIf="(_mode != 'time')&&showTime">选择时间</a>
                  <a class="ant-calendar-time-picker-btn" (click)="_changeYearView($event)"
                     *ngIf="(_mode == 'time')&&showTime">选择日期</a>
                  <a class="ant-calendar-ok-btn" *ngIf="showTime" (click)="_closeCalendar()">确 定</a>
                </span>
            </div>
          </div>
        </div>
      </div>
    </ng-template>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  _el: HTMLElement;
  _open = false;
  _mode = 'year';
  _dropDownPosition = 'bottom';
  _triggerWidth = 0;
  _value = null;
  _disabled = false;
  _today = new Date();
  _selectedMonth = moment(this.value).month();
  _selectedYear = moment(this.value).year();
  _selectedDate = moment(this.value).date();
  _showMonth = moment(new Date()).month();
  _showYear = moment(new Date()).year();
  _startDecade = Math.floor(this._showYear / 10) * 10;
  _yearPanel: Array<Array<string>> = [];
  _positions: ConnectionPositionPair[] = [...DEFAULT_DATEPICKER_POSITIONS];
  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;
  /**
   * The callback for using disable date, return true then will disable date
   * 用于禁用日期的回调函数，返回true表示禁用此日期
   */
  @Input() disabledDate;
  @Input() allowClear = true;
  /**
   * The date time options, reference to tri-timepicker
   * 时间选项, 参见 tri-timepicker
   */
  @Input() showTime: any = null;
  @Input() placeHolder = '请选择日期';
  /**
   * The format of date show, config reference to [Moment.js](http://momentjs.cn/docs/#/parsing/string-formats)
   * 展示的日期格式，配置参考 [Moment.js](http://momentjs.cn/docs/#/parsing/string-formats) 文档
   */
  @Input() format = 'YYYY-MM-DD';
  /**
   * The input size, the height of `large` is 32px, the height of `small` is 22px, default is 28px
   * 输入框大小， `large`  高度为 32px， `small`  为 22px，默认是 28px
   */
  @Input() size = '';
  @Input() mode: 'day' | 'month' = 'day';
  @ViewChild('trigger') trigger;
  @ViewChild(TimePickerInnerComponent) timePickerInner: TimePickerInnerComponent;
  @HostBinding('class.ant-calendar-picker') _calendarPicker = true;

  /**
   * Whether disabled
   * 是否禁用
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Set Whether disabled
   * 设置是否禁用
   * @param  value
   */
  set disabled(value: boolean) {
    this._disabled = value;
    this._closeCalendar();
  }

  _setTriggerWidth(): void {
    this._triggerWidth = this.trigger.nativeElement.getBoundingClientRect().width;
  }

  onPositionChange(position) {
    const _position = position.connectionPair.originY === 'bottom' ? 'top' : 'bottom';
    if (this._dropDownPosition !== _position) {
      this._dropDownPosition = _position;
      this._cdr.detectChanges();
    }
  }

  get value(): Date {
    return this._value || new Date();
  }

  set value(value: Date) {
    this._updateValue(value);
  }

  _changeTime($event) {
    this._value = $event;
  }

  _blurInput(box) {
    if (Date.parse(box.value)) {
      this.value = new Date(box.value);
      this.onChange(this._value);
    }
  }

  _preYear() {
    this._showYear = this._showYear - 1;
  }

  _nextYear() {
    this._showYear = this._showYear + 1;
  }

  _preMonth() {
    if (this._showMonth - 1 < 0) {
      this._showMonth = 11;
      this._preYear();
    } else {
      this._showMonth = this._showMonth - 1;
    }
  }

  _nextMonth() {
    if (this._showMonth + 1 > 11) {
      this._showMonth = 0;
      this._nextYear();
    } else {
      this._showMonth = this._showMonth + 1;
    }
  }

  _setShowYear(year, $event) {
    $event.stopPropagation();
    this._showYear = year;
    this._mode = this.mode === 'day' ? 'year' : 'month';
  }

  _preDecade() {
    this._startDecade = this._startDecade - 10;
  }

  _nextDecade() {
    this._startDecade = this._startDecade + 10;
  }

  _clearValue(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.value = null;
    this.onChange(this._value);
  }

  _changeToToday() {
    this.value = new Date();
    this.onChange(this._value);
    this._closeCalendar();
  }

  _clickDay(day) {
    if (!this.showTime) {
      this._closeCalendar();
      this.value = day.date.toDate();
      this.onChange(this._value);
    } else {
      this.value = moment(this.value)
        .year(day.date.year())
        .month(day.date.month())
        .date(day.date.date())
        .toDate();
      this.onChange(this._value);
    }
  }

  _clickMonth(month) {
    if (this.mode === 'month') {
      this._closeCalendar();
      this.value = moment(this.value)
        .year(this._showYear)
        .month(month.index)
        .toDate();
      this.onChange(this._value);
    } else {
      this._showMonth = month.index;
      this._mode = 'year';
    }
  }

  _openCalendar() {
    if (this.disabled) {
      return;
    }
    this._mode = this.mode === 'day' ? 'year' : 'month';
    this._open = true;
    this._setTriggerWidth();
  }

  _closeCalendar() {
    if (!this._open) {
      return;
    }
    if (this.showTime) {
      this.onChange(this._value);
    }
    this._open = false;
  }

  _changeMonthView() {
    this._mode = 'month';
  }

  _changeDecadeView($event) {
    $event.stopPropagation();
    this._mode = 'decade';
  }

  _changeTimeView($event) {
    $event.stopPropagation();
    this._mode = 'time';
    setTimeout(_ => {
      this.timePickerInner._initPosition();
    });
  }

  _changeYearView($event) {
    $event.stopPropagation();
    this._mode = 'year';
  }

  get _showClearIcon() {
    return this._value && !this.disabled && this.allowClear;
  }

  _generateYearPanel() {
    let _t = [];
    for (let i = 0; i < 10; i++) {
      if (i === 1 || i === 4 || i === 7 || i === 9) {
        _t.push(i);
        this._yearPanel.push(_t);
        _t = [];
      } else {
        _t.push(i);
      }
    }
    this._yearPanel[0].unshift('start');
    this._yearPanel[3].push('end');
  }

  constructor(private _elementRef: ElementRef, private _cdr: ChangeDetectorRef) {
    this._el = this._elementRef.nativeElement;
  }

  ngOnInit() {
    this._generateYearPanel();
  }

  writeValue(value: any): void {
    // this.value = value;
    this._updateValue(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private _updateValue(value: any) {
    if (this._value === value) {
      return;
    }
    this._value = value;
    this._selectedMonth = moment(this.value).month();
    this._selectedYear = moment(this.value).year();
    this._selectedDate = moment(this.value).date();
    this._showYear = moment(this.value).year();
    this._showMonth = moment(this.value).month();
    this._startDecade = Math.floor(this._showYear / 10) * 10;
  }
}
