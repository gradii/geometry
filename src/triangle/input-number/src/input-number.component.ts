/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TAB } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  isBlank,
  isInfinite,
  isNullOrEmptyString,
  isNumeric,
  isPresent
} from '@gradii/triangle/util';

@Component({
  selector     : 'tri-input-number',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div class="tri-input-number-handler-wrap"
         (mouseover)="_mouseInside = true"
         (mouseout)="_mouseInside = false">
      <a *ngIf="spinners"
         class="tri-input-number-handler tri-input-number-handler-up"
         [class.tri-input-number-handler-up-disabled]="_disabledUp"
         (click)="_numberUp($event)">
        <span
          class="tri-input-number-handler-up-inner"
          (click)="$event.preventDefault();"></span>
      </a>
      <a *ngIf="spinners"
         class="tri-input-number-handler tri-input-number-handler-down"
         [class.tri-input-number-handler-down-disabled]="_disabledDown"
         (click)="_numberDown($event)">
        <span
          class="tri-input-number-handler-down-inner"
          (click)="$event.preventDefault();">
        </span>
      </a>
    </div>
    <div
      class="tri-input-number-input-wrap">
      <input class="tri-input-number-input"
             #inputNumber
             [placeholder]="placeHolder"
             [disabled]="disabled"
             [(ngModel)]="_displayValue"
             (blur)="_emitBlur($event)"
             (focus)="_emitFocus($event)"
             (keydown)="_emitKeydown($event)"
             (ngModelChange)="_userInputChange()"
             [attr.min]="min"
             [attr.max]="max"
             [attr.step]="_step"
             autocomplete="off">
    </div>`,
  styleUrls    : [`../style/input-number.css`],
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi      : true
    }
  ]
})
export class InputNumberComponent implements ControlValueAccessor {

  _el: HTMLElement;
  _prefixCls = 'tri-input-number';
  _precisionStep = 0;
  _precisionFactor = 1;
  _disabledUp = false;
  _disabledDown = false;
  _focused = false;
  _mouseInside = false;
  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;
  @ViewChild('inputNumber', {static: false}) _inputNumber: ElementRef;
  /**
   * Placeholder
   */
  @Input() placeHolder = '';
  /**
   * whether show up/down spinner
   */
  @Input() spinners: boolean = true;
  /**
   * Whether disabled
   * 禁用
   */
  @Input()
  @HostBinding('class.tri-input-number-disabled')
  disabled = false;
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
    this._el = this._elementRef.nativeElement;
    this._renderer.addClass(this._el, `${this._prefixCls}`);
  }

  private _min: number = -Infinity;

  /**
   * Min number
   * 最小值
   */
  @Input()
  get min(): number {
    return this._min;
  }

  set min(value: number) {
    if (isNumeric(value) || isInfinite(value)) {
      this._min = value;
    }
  }

  private _max: number = Infinity;

  /**
   * Max number
   * 最大值
   */
  @Input()
  get max(): number {
    return this._max;
  }

  set max(value: number) {
    if (isNumeric(value) || isInfinite(value)) {
      this._max = value;
    }
  }

  _value: number;

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._updateValue(value);
  }

  _size: any = 'default';

  /**
   * Get the input size
   * 获取输入框大小
   */
  @Input()
  get size(): string {
    return this._size;
  }

  /**
   * Set the input size
   * 设置输入框大小
   * @param  value
   */
  set size(value: string) {
    this._renderer.removeClass(this._el, `${this._prefixCls}-${this._size}`);
    this._size = {large: 'lg', small: 'sm'}[value];
    this._renderer.addClass(this._el, `${this._prefixCls}-${this._size}`);
  }

  _step = 1;

  /**
   * The step every change
   * 每次改变步数
   */
  @Input()
  get step(): number {
    return this._step;
  }

  /**
   * The step every change, can be fractional
   * 每次改变步数，可以为小数
   */
  set step(value: number) {
    if (isPresent(value)) {
      this._step = value;
      const stepString = value.toString();
      if (stepString.indexOf('e-') >= 0) {
        this._precisionStep = parseInt(stepString.slice(stepString.indexOf('e-')), 10);
      }
      if (stepString.indexOf('.') >= 0) {
        this._precisionStep = stepString.length - stepString.indexOf('.') - 1;
      }
      this._precisionFactor = Math.pow(10, this._precisionStep);
    }
  }

  _displayValue: any;

  private get displayValue() {
    return this._displayValue;
  }

  private set displayValue(value) {
    this._displayValue = isBlank(value) ? '' : value;
  }

  _numberUp($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this._inputNumber.nativeElement.focus();
    if (isBlank(this.value)) {
      this.value = isInfinite(this._min) ? 0 : this._min;
    }
    if (!this._disabledUp) {
      this.value = this.toPrecisionAsStep(
        (this._precisionFactor * this.value + this._precisionFactor * this.step) / this._precisionFactor
      );
    }
  }

  _numberDown($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this._inputNumber.nativeElement.focus();
    if (isBlank(this.value)) {
      this.value = isInfinite(this._min) ? 0 : this._min;
    }
    if (!this._disabledDown) {
      this.value = this.toPrecisionAsStep(
        (this._precisionFactor * this.value - this._precisionFactor * this.step) / this._precisionFactor
      );
    }
  }

  _emitBlur($event: FocusEvent) {
    // avoid unnecessary events
    if (this._focused && !this._mouseInside) {
      this._checkValue();
      this._focused = false;
      this.blur.emit($event);
    }
    this.onTouched();
  }

  _emitFocus($event: FocusEvent) {
    // avoid unnecessary events
    if (!this._focused) {
      this._focused = true;
      this.focus.emit($event);
    }
  }

  _emitKeydown($event: KeyboardEvent) {
    if ($event.keyCode === TAB && this._focused) {
      this._focused = false;
      this.blur.emit($event);
    }
  }

  _userInputChange() {
    if (isNullOrEmptyString(this._displayValue)) {
      this.value = undefined;
    } else if (this._displayValue === 'Infinity') {
      this.value = Infinity;
    } else if (this._displayValue === '-Infinity') {
      this.value = -Infinity;
    } else {
      const numberValue = +this._displayValue;
      if (this._isNumber(numberValue) && numberValue <= this._max && numberValue >= this._min) {
        this.value = numberValue;
      }
    }
  }

  _checkValue() {
    this.displayValue = this.value;
  }

  _getBoundValue(value: number) {
    if (value > this._max) {
      return this._max;
    } else if (value < this._min) {
      return this._min;
    } else {
      return value;
    }
  }

  _isNumber(value: any) {
    return !isNaN(value) && isFinite(value);
  }

  toPrecisionAsStep(num: number) {
    if (isNaN(num)) {
      return num;
    }
    return Number(Number(num).toFixed(this._precisionStep));
  }

  writeValue(value: any): void {
    // this.value = value;
    this._updateValue(value, false);
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

  private _updateValue(value: number, emitChange = true) {
    if (this._value === value) {
      return;
    }
    this._value = this._getBoundValue(value);
    this.displayValue = this._value;
    // this._inputNumber.nativeElement.value = this._value;
    if (emitChange) {
      this.onChange(this._value);
    }
    this._disabledUp = this.value !== undefined && !(this.value + this.step <= this._max);
    this._disabledDown = this.value !== undefined && !(this.value - this.step >= this._min);
  }
}
