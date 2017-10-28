import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { DropDownAnimation } from '@gradii/triangle/core';

export interface TimeUnitInterface {
  index: number;
  name: string;
  disabled: boolean;
}

@Component({
  selector: 'tri-timepicker-inner',
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      class="ant-calendar-time-picker"
      [ngClass]="{'ant-time-picker-large':size=='large','ant-time-picker-small':size=='small'}">
      <div
        class="ant-calendar-time-picker-panel"
        [@dropDownAnimation]="'bottom'">
        <div class="ant-calendar-time-picker-inner"
             [class.ant-calendar-time-picker-column-3]="_showHour&&_showMinute&&_showSecond"
             [class.ant-calendar-time-picker-column-2]="_showHour&&_showMinute&&!_showSecond"
             [class.ant-calendar-time-picker-column-1]="_showHour&&(!_showMinute)&&(!_showSecond)">
        <div class="ant-calendar-time-picker-combobox">
          <div
            class="ant-calendar-time-picker-select"
            #hourListInstance
            *ngIf="_showHour">
            <ul>
              <ng-template
                ngFor
                let-_hour
                [ngForOf]="_hourList"
                let-i="index">
                 <li
                   [ngClass]="_hour.name"
                   *ngIf="!(hideDisabledOptions && _hour.disabled)"
                   [class.ant-time-picker-panel-select-option-selected]="_hour.index===_selectedHour"
                   [class.ant-time-picker-panel-select-option-disabled]="_hour.disabled"
                   (click)="_selectHour(hourListInstance,_hour.index,_hour.disabled)">
                   {{_hour.name}}
                 </li>
              </ng-template>
            </ul>
          </div>
          <div
            class="ant-calendar-time-picker-select"
            #minuteListInstance
            *ngIf="_showMinute">
            <ul>
              <ng-template
                ngFor
                let-_minute
                [ngForOf]="_minuteList"
                let-i="index">
                 <li
                   [ngClass]="_minute.name"
                   *ngIf="!(hideDisabledOptions && _minute.disabled)"
                   [class.ant-time-picker-panel-select-option-selected]="_minute.index === _selectedMinute"
                   [class.ant-time-picker-panel-select-option-disabled]="_minute.disabled"
                   (click)="_selectMinute(minuteListInstance,_minute.index,_minute.disabled)">
                   {{_minute.name}}
                 </li>
              </ng-template>
            </ul>
          </div>
          <div
            class="ant-calendar-time-picker-select"
            #secondListInstance
            *ngIf="_showSecond">
            <ul>
              <ng-template
                ngFor
                let-_second
                [ngForOf]="_secondList"
                let-i="index">
                 <li
                   [ngClass]="_second.name"
                   *ngIf="!(hideDisabledOptions&&_second.disabled)"
                   [class.ant-time-picker-panel-select-option-selected]="_second.index === _selectedSecond"
                   [class.ant-time-picker-panel-select-option-disabled]="_second.disabled"
                   (click)="_selectSecond(secondListInstance, _second.index, _second.disabled)">
                   {{_second.name}}
                 </li>
              </ng-template>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </span>`,
  animations: [DropDownAnimation],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerInnerComponent),
      multi: true
    }
  ]
})
export class TimePickerInnerComponent implements OnInit, ControlValueAccessor {
  _now = new Date();
  _el: HTMLElement;
  _open = false;
  _hourList: Array<TimeUnitInterface> = [];
  _minuteList: Array<TimeUnitInterface> = [];
  _secondList: Array<TimeUnitInterface> = [];
  _value = null;
  _selectedHour = moment(this._now).hours();
  _selectedMinute = moment(this._now).minutes();
  _selectedSecond = moment(this._now).seconds();
  _format = 'HH:mm:ss';
  _showHour = this._format.indexOf('HH') > -1;
  _showMinute = this._format.indexOf('mm') > -1;
  _showSecond = this._format.indexOf('ss') > -1;
  _width = (+this._showHour + +this._showMinute + +this._showSecond) * 56 + 1 + 'px';
  _hideDisabledOptions = false;
  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;

  @ViewChild('hourListInstance') _hourListInstance;
  @ViewChild('minuteListInstance') _minuteListInstance;
  @ViewChild('inputTimeInstance') _inputTimeInstance;
  @ViewChild('secondListInstance') _secondListInstance;

  /**
   * Set this property to hidden disabled options
   * 添加该属性来隐藏禁止选择的选项
   * @param  value
   */
  @Input()
  set hideDisabledOptions(value: boolean) {
    this._hideDisabledOptions = value as boolean;
  }

  /**
   * Get hide idsbled options
   * 获取隐藏禁止选择的选项
   */
  get hideDisabledOptions() {
    return this._hideDisabledOptions;
  }

  /**
   * Place holder
   * 默认显示
   */
  @Input() placeHolder = '请选择时间';
  /**
   * Size
   * 大小
   */
  @Input() size: 'small' | 'large' | 'default' = 'default';
  /**
   * disabled hours
   * 禁止选择部分小时选项
   */
  @Input() disabledHours;
  /**
   * disabled minutes
   */
  @Input() disabledMinutes;
  /**
   * disabled seconds
   */
  @Input() disabledSeconds;
  /**
   * whethder disabled
   */
  @Input() disabled = false;

  /**
   * Get the time format
   * 获取展示的时间格式
   */
  @Input()
  get format() {
    return this._format;
  }

  /**
   * Set the time format
   * 设置展示的时间格式
   * @param value
   */
  set format(value) {
    this._format = value;
    this._showHour = this._format.indexOf('HH') > -1;
    this._showMinute = this._format.indexOf('mm') > -1;
    this._showSecond = this._format.indexOf('ss') > -1;
    this._width = (+this._showHour + +this._showMinute + +this._showSecond) * 56 + 1 + 'px';
  }

  get value(): Date {
    return this._value || this._now;
  }

  set value(value: Date) {
    if (this._value === value) {
      return;
    }
    this._value = value;
    this._selectedHour = moment(this.value).hours();
    this._selectedMinute = moment(this.value).minutes();
    this._selectedSecond = moment(this.value).seconds();
  }

  _scrollToSelected(instance, index, duration = 0, unit) {
    const _transIndex = this._translateIndex(index, unit);
    const currentOption = instance.children[0].children[_transIndex] || instance.children[0].children[0];
    this.scrollTo(instance, currentOption.offsetTop, duration);
  }

  // got from rc-timepicker
  scrollTo(element, to, duration) {
    const requestAnimationFrame =
      window.requestAnimationFrame ||
      function requestAnimationFrameTimeout() {
        return setTimeout(arguments[0], 10);
      };
    if (duration <= 0) {
      element.scrollTop = to;
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;

    requestAnimationFrame(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) {
        return;
      }
      this.scrollTo(element, to, duration - 10);
    });
  }

  _selectHour(instance, index, disabled) {
    if (disabled) {
      return;
    }
    this._scrollToSelected(instance, index, 120, 'hour');
    this._selectedHour = index;
    this.value = moment(this.value)
      .hour(index)
      .toDate();
    this.onChange(this._value);
    this._buildMinutes();
    this._buildSeconds();
  }

  _selectMinute(instance, index, disabled) {
    if (disabled) {
      return;
    }
    this._scrollToSelected(instance, index, 120, 'minute');
    this._selectedMinute = index;
    this.value = moment(this.value)
      .minute(index)
      .toDate();
    this.onChange(this._value);
    this._buildSeconds();
  }

  _selectSecond(instance, index, disabled) {
    if (disabled) {
      return;
    }
    this._scrollToSelected(instance, index, 120, 'second');
    this._selectedSecond = index;
    this.value = moment(this.value)
      .second(index)
      .toDate();
    this.onChange(this._value);
  }

  _translateIndex(index, unit) {
    if (!this.hideDisabledOptions) {
      return index;
    }
    if (unit === 'hour') {
      const disabledHours = this.disabledHours && this.disabledHours();
      return this._calcIndex(disabledHours, index);
    } else if (unit === 'minute') {
      const disabledMinutes = this.disabledMinutes && this.disabledMinutes(this._selectedHour);
      return this._calcIndex(disabledMinutes, index);
    } else if (unit === 'second') {
      const disabledSeconds = this.disabledSeconds && this.disabledSeconds(this._selectedHour, this._selectedMinute);
      return this._calcIndex(disabledSeconds, index);
    }
  }

  _calcIndex(array, index) {
    if (array && array.length) {
      return (
        index -
        array.reduce((pre, value) => {
          return pre + (value < index ? 1 : 0);
        }, 0)
      );
    } else {
      return index;
    }
  }

  _initPosition() {
    this._selectedHour = moment(this.value).hours();
    this._selectedMinute = moment(this.value).minutes();
    this._selectedSecond = moment(this.value).seconds();
    if (this._showHour) {
      this._scrollToSelected(this._hourListInstance.nativeElement, this._selectedHour, 0, 'hour');
    }
    if (this._showMinute) {
      this._scrollToSelected(this._minuteListInstance.nativeElement, this._selectedMinute, 0, 'minute');
    }
    if (this._showSecond) {
      this._scrollToSelected(this._secondListInstance.nativeElement, this._selectedSecond, 0, 'second');
    }
  }

  _buildTime() {
    this._buildHours();
    this._buildMinutes();
    this._buildSeconds();
  }

  _buildHours() {
    this._hourList = [];
    for (let i = 0; i <= 23; i++) {
      this._hourList.push({
        disabled: this.disabledHours && this.disabledHours().indexOf(i) !== -1,
        name: i.toString().length === 1 ? '0' + i : '' + i,
        index: i
      });
    }
  }

  _buildMinutes() {
    this._minuteList = [];
    for (let i = 0; i <= 59; i++) {
      this._minuteList.push({
        disabled: this.disabledMinutes && this.disabledMinutes(this._selectedHour).indexOf(i) !== -1,
        name: i.toString().length === 1 ? '0' + i : '' + i,
        index: i
      });
    }
  }

  _buildSeconds() {
    this._secondList = [];
    for (let i = 0; i <= 59; i++) {
      this._secondList.push({
        disabled:
          this.disabledSeconds && this.disabledSeconds(this._selectedHour, this._selectedMinute).indexOf(i) !== -1,
        name: i.toString().length === 1 ? '0' + i : '' + i,
        index: i
      });
    }
  }

  writeValue(value: any): void {
    this.value = value;
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

  constructor(public _cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this._buildTime();
  }
}
