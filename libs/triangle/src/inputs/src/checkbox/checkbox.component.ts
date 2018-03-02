import { Component, EventEmitter, forwardRef, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  moduleId     : module.id,
  selector     : 'tri-checkbox',
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  template     : `
    <label>
      <span [class.ant-checkbox]="true"
            [class.ant-checkbox-checked]="_checked && !indeterminate"
            [class.ant-checkbox-focused]="_focused"
            [class.ant-checkbox-disabled]="disabled"
            [class.ant-checkbox-indeterminate]="indeterminate">
        <span class="ant-checkbox-inner"></span>
        <input type="checkbox"
               class="ant-checkbox-input"
               [ngModel]="checked"
               (focus)="focus()"
               (blur)="onTouched();blur()">
      </span>
      <ng-content></ng-content>
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
    '[class.ant-checkbox-wrapper]': 'true'
  }
})
export class CheckboxComponent implements ControlValueAccessor {
  _el: HTMLElement;
  _checked = false;
  _focused = false;
  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;

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

  @Input() label;

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

  @Output() change = new EventEmitter<any>();

  @HostListener('click', ['$event'])
  onClick(e) {
    e.preventDefault();
    if (!this.disabled) {
      this.updateValue(!this._checked);
    }
  }

  updateValue(value) {
    if (value === this._checked) {
      return;
    }
    this.onChange(value);
    this._checked = value;

    this.change.emit({sender: this, checked: value});
  }

  focus() {
    this._focused = true;
  }

  blur() {
    this._focused = false;
  }

  constructor() {}

  writeValue(value: any): void {
    this._checked = value;
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
