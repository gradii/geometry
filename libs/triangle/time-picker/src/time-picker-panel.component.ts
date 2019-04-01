import { reqAnimFrame } from '@gradii/triangle/core';
import { isPresent } from '@gradii/triangle/util';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimeHolder } from './time-holder';
import { TimeValueAccessorDirective } from './time-value-accessor.directive';

function makeRange(length: number, step: number = 1): number[] {
  return new Array(Math.ceil(length / step)).fill(0).map((_, i) => i * step);
}

@Component({
  selector   : 'tri-time-picker-panel',
  templateUrl: './time-picker-panel.component.html',
  providers  : [
    {provide: NG_VALUE_ACCESSOR, useExisting: TimePickerPanelComponent, multi: true}
  ],
  host       : {
    '[class.tri-time-picker-panel]'                     : '!inDatePicker',
    '[class.tri-calendar-time-picker]'            : 'inDatePicker',
    '[class.tri-time-picker-panel-column-0]'            : 'enabledColumns === 0 && !inDatePicker',
    '[class.tri-time-picker-panel-column-1]'            : 'enabledColumns === 1 && !inDatePicker',
    '[class.tri-time-picker-panel-column-2]'            : 'enabledColumns === 2 && !inDatePicker',
    '[class.tri-time-picker-panel-column-3]'            : 'enabledColumns === 3 && !inDatePicker',
    '[class.tri-time-picker-panel-narrow]'              : 'enabledColumns < 3',
    '[class.tri-time-picker-panel-placement-bottomLeft]': 'inDatePicker ? false : true'
  }
})
export class TimePickerPanelComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private _hourStep = 1;
  private _minuteStep = 1;
  private _secondStep = 1;
  private unsubscribe$ = new Subject<void>();
  private onChange: (value: Date) => void;
  private onTouch: () => void;
  private _format = 'HH:mm:ss';
  private _disabledHours: () => number[];
  private _disabledMinutes: (hour: number) => number[];
  private _disabledSeconds: (hour: number, minute: number) => number[];
  private _defaultOpenValue = new Date();
  private _opened = false;
  private _allowEmpty = true;
  prefixCls: string = 'tri-time-picker-panel';
  time = new TimeHolder();
  hourEnabled = true;
  minuteEnabled = true;
  secondEnabled = true;
  enabledColumns = 3;
  hourRange: ReadonlyArray<{ index: number, disabled: boolean }>;
  minuteRange: ReadonlyArray<{ index: number, disabled: boolean }>;
  secondRange: ReadonlyArray<{ index: number, disabled: boolean }>;
  @ViewChild(TimeValueAccessorDirective) timeValueAccessorDirective: TimeValueAccessorDirective;
  @ViewChild('hourListElement') hourListElement;
  @ViewChild('minuteListElement') minuteListElement;
  @ViewChild('secondListElement') secondListElement;
  @Input() inDatePicker: boolean = false; // If inside a date-picker, more diff works need to be done
  @Input() addOn: TemplateRef<void>;
  @Input() hideDisabledOptions = false;
  @Input() clearText: string;
  @Input() placeHolder: string;
  @Output() timeClear = new EventEmitter<void>();

  @Input()
  set allowEmpty(value: boolean) {
    if (isPresent(value)) {
      this._allowEmpty = value;
    }
  }

  get allowEmpty(): boolean {
    return this._allowEmpty;
  }

  @Input()
  set opened(value: boolean) {
    this._opened = value;
    if (this.opened) {
      this.initPosition();
      this.selectInputRange();
    }
  }

  get opened(): boolean {
    return this._opened;
  }

  @Input()
  set defaultOpenValue(value: Date) {
    if (isPresent(value)) {
      this._defaultOpenValue = value;
      this.time.setDefaultOpenValue(this.defaultOpenValue);
    }
  }

  get defaultOpenValue(): Date {
    return this._defaultOpenValue;
  }

  @Input()
  set disabledHours(value: () => number[]) {
    this._disabledHours = value;
    if (this._disabledHours) {
      this.buildHours();
    }
  }

  get disabledHours(): () => number[] {
    return this._disabledHours;
  }

  @Input()
  set disabledMinutes(value: (hour: number) => number[]) {
    if (isPresent(value)) {
      this._disabledMinutes = value;
      this.buildMinutes();
    }
  }

  get disabledMinutes(): (hour: number) => number[] {
    return this._disabledMinutes;
  }

  @Input()
  set disabledSeconds(value: (hour: number, minute: number) => number[]) {
    if (isPresent(value)) {
      this._disabledSeconds = value;
      this.buildSeconds();
    }
  }

  get disabledSeconds(): (hour: number, minute: number) => number[] {
    return this._disabledSeconds;
  }

  @Input()
  set format(value: string) {
    if (isPresent(value)) {
      this._format = value;
      this.enabledColumns = 0;
      const charSet = new Set(value);
      this.hourEnabled = charSet.has('H') || charSet.has('h');
      this.minuteEnabled = charSet.has('m');
      this.secondEnabled = charSet.has('s');
      if (this.hourEnabled) {
        this.enabledColumns++;
      }
      if (this.minuteEnabled) {
        this.enabledColumns++;
      }
      if (this.secondEnabled) {
        this.enabledColumns++;
      }
    }
  }

  get format(): string {
    return this._format;
  }

  @Input()
  set hourStep(value: number) {
    if (isPresent(value)) {
      this._hourStep = value;
      this.buildHours();
    }
  }

  get hourStep(): number {
    return this._hourStep;
  }

  @Input()
  set minuteStep(value: number) {
    if (isPresent(value)) {
      this._minuteStep = value;
      this.buildMinutes();
    }
  }

  get minuteStep(): number {
    return this._minuteStep;
  }

  @Input()
  set secondStep(value: number) {
    if (isPresent(value)) {
      this._secondStep = value;
      this.buildSeconds();
    }
  }

  get secondStep(): number {
    return this._secondStep;
  }

  selectInputRange(): void {
    setTimeout(() => {
      if (this.timeValueAccessorDirective) {
        this.timeValueAccessorDirective.setRange();
      }
    });
  }

  buildHours(): void {
    this.hourRange = makeRange(24, this.hourStep).map(r => {
        return {
          index   : r,
          disabled: this.disabledHours && (this.disabledHours().indexOf(r) !== -1)
        };
      }
    );
  }

  buildMinutes(): void {
    this.minuteRange = makeRange(60, this.minuteStep).map(r => {
        return {
          index   : r,
          disabled: this.disabledMinutes && (this.disabledMinutes(this.time.hours).indexOf(r) !== -1)
        };
      }
    );
  }

  buildSeconds(): void {
    this.secondRange = makeRange(60, this.secondStep).map(r => {
        return {
          index   : r,
          disabled: this.disabledSeconds && (this.disabledSeconds(this.time.hours, this.time.minutes).indexOf(r) !== -1)
        };
      }
    );
  }

  buildTimes(): void {
    this.buildHours();
    this.buildMinutes();
    this.buildSeconds();
  }

  selectHour(hour: { index: number, disabled: boolean }): void {
    this.time.setHours(hour.index, hour.disabled);
    this.scrollToSelected(this.hourListElement.nativeElement, hour.index, 120, 'hour');

    if (this._disabledMinutes) {
      this.buildMinutes();
    }
    if (this._disabledSeconds || this._disabledMinutes) {
      this.buildSeconds();
    }
  }

  selectMinute(minute: { index: number, disabled: boolean }): void {
    this.time.setMinutes(minute.index, minute.disabled);
    this.scrollToSelected(this.minuteListElement.nativeElement, minute.index, 120, 'minute');
    if (this._disabledSeconds) {
      this.buildSeconds();
    }
  }

  selectSecond(second: { index: number, disabled: boolean }): void {
    this.time.setSeconds(second.index, second.disabled);
    this.scrollToSelected(this.secondListElement.nativeElement, second.index, 120, 'second');
  }

  scrollToSelected(instance: HTMLElement, index: number, duration: number = 0, unit: string): void {
    const transIndex = this.translateIndex(index, unit);
    const currentOption = (instance.children[0].children[transIndex] || instance.children[0].children[0]) as HTMLElement;
    this.scrollTo(instance, currentOption.offsetTop, duration);
  }

  translateIndex(index: number, unit: string): number {
    if (unit === 'hour') {
      const disabledHours = this.disabledHours && this.disabledHours();
      return this.calcIndex(disabledHours, this.hourRange.map(item => item.index).indexOf(index));
    } else if (unit === 'minute') {
      const disabledMinutes = this.disabledMinutes && this.disabledMinutes(this.time.hours);
      return this.calcIndex(disabledMinutes, this.minuteRange.map(item => item.index).indexOf(index));
    } else if (unit === 'second') {
      const disabledSeconds = this.disabledSeconds && this.disabledSeconds(this.time.hours, this.time.minutes);
      return this.calcIndex(disabledSeconds, this.secondRange.map(item => item.index).indexOf(index));
    }
  }

  scrollTo(element: HTMLElement, to: number, duration: number): void {
    if (duration <= 0) {
      element.scrollTop = to;
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;

    reqAnimFrame(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) {
        return;
      }
      this.scrollTo(element, to, duration - 10);
    });
  }

  calcIndex(array: number[], index: number): number {
    if (array && array.length && this.hideDisabledOptions) {
      return index - array.reduce((pre, value) => {
        return pre + (value < index ? 1 : 0);
      }, 0);
    } else {
      return index;
    }
  }

  clear(): void {
    this.time.clear();
    this.timeClear.emit();
  }

  protected changed(): void {
    if (this.onChange) {
      this.onChange(this.time.value);
    }
  }

  protected touched(): void {
    if (this.onTouch) {
      this.onTouch();
    }
  }

  isSelectedHour(hour: { index: number, disabled: boolean }): boolean {
    return (hour.index === this.time.hours) || (!isPresent(this.time.hours) && (hour.index === this.time.defaultHours));
  }

  isSelectedMinute(minute: { index: number, disabled: boolean }): boolean {
    return (minute.index === this.time.minutes) || (!isPresent(this.time.minutes) && (minute.index === this.time.defaultMinutes));
  }

  isSelectedSecond(second: { index: number, disabled: boolean }): boolean {
    return (second.index === this.time.seconds) || (!isPresent(this.time.seconds) && (second.index === this.time.defaultSeconds));
  }

  initPosition(): void {
    setTimeout(() => {
      if (this.hourEnabled && this.hourListElement) {
        if (isPresent(this.time.hours)) {
          this.scrollToSelected(this.hourListElement.nativeElement, this.time.hours, 0, 'hour');
        } else {
          this.scrollToSelected(this.hourListElement.nativeElement, this.time.defaultHours, 0, 'hour');
        }
      }
      if (this.minuteEnabled && this.minuteListElement) {
        if (isPresent(this.time.minutes)) {
          this.scrollToSelected(this.minuteListElement.nativeElement, this.time.minutes, 0, 'minute');
        } else {
          this.scrollToSelected(this.minuteListElement.nativeElement, this.time.defaultMinutes, 0, 'minute');
        }
      }
      if (this.secondEnabled && this.secondListElement) {
        if (isPresent(this.time.seconds)) {
          this.scrollToSelected(this.secondListElement.nativeElement, this.time.seconds, 0, 'second');
        } else {
          this.scrollToSelected(this.secondListElement.nativeElement, this.time.defaultSeconds, 0, 'second');
        }
      }
    });
  }

  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
    if (this.inDatePicker) {
      this.prefixCls = 'tri-calendar-time-picker';
    }

    this.time.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.changed();
      this.touched();
    });
    this.buildTimes();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  writeValue(value: Date): void {
    this.time.value = value;
    this.buildTimes();
  }

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

}
