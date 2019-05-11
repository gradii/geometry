import {
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isFunction } from '@gradii/triangle/util';

/**
 * form value bind with checked
 */
@Component({
  selector     : 'tri-checkbox',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <label>
      <span [class.tri-checkbox]="true"
            [class.tri-checkbox-checked]="_checked && !indeterminate"
            [class.tri-checkbox-focused]="_focused"
            [class.tri-checkbox-disabled]="disabled"
            [class.tri-checkbox-indeterminate]="indeterminate">
        <span class="tri-checkbox-inner"></span>
        <input type="checkbox"
               class="tri-checkbox-input"
               [attr.value]="value"
               [ngModel]="checked"
               (focus)="focus()"
               (blur)="blur()"
               (change)="$event.stopPropagation()">
      </span>
      <ng-template [ngIf]="label"><span>{{label}}</span></ng-template>
      <ng-template [ngIf]="!label">
        <ng-content></ng-content>
      </ng-template>
    </label>
  `,
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi      : true
    }
  ],
  host         : {
    '[class.tri-checkbox-wrapper]': 'true'
  }
})
export class CheckboxComponent implements ControlValueAccessor {

  _el: HTMLElement;
  _focused = false;
  // ngModel Access
  onChange: Function;
  onTouched: Function;
  /**
   * Whether disable
   * 是否禁用
   */
  @Input() disabled = false;
  /**
   * Set indeterminate sate, related to ant-checkbox-indeterminate style
   * 设置 indeterminate 状态，只负责样式控制
   */
  @Input() indeterminate = false;
  @Input() label: string;
  @Input() value: any;
  @Input() initValue: boolean = true;
  @Output() change = new EventEmitter<any>();
  @Output() indeterminateChange = new EventEmitter<any>();

  constructor() {}

  _checked = false;

  /**
   * whether checked
   * 是否选中
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(value) {
    this._checked = value;
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    e.preventDefault();
    if (!this.disabled) {
      if (this.indeterminate && this._checked) {
        this.indeterminate = false;
        this.indeterminateChange.emit(this.indeterminate);
      }

      this.updateValue(!this._checked);
    }
  }

  updateValue(value) {
    if (value === this._checked) {
      return;
    }
    if (isFunction(this.onChange)) {
      this.onChange(value);
    }
    this._checked = value;

    this.change.emit({sender: this, checked: value});
  }

  focus() {
    this._focused = true;
  }

  blur() {
    this._focused = false;
    if (isFunction(this.onTouched)) {
      this.onTouched();
    }
  }

  writeValue(value: any): void {
    this._checked = !!value;
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
}
