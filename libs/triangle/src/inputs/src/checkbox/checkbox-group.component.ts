import { AfterContentInit, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  moduleId           : module.id,
  selector           : 'tri-checkbox-group',
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  template           : `
    <tri-checkbox
      [class.ant-checkbox-vertical]="type=='vertical'"
      *ngFor="let option of _options"
      [disabled]="option.disabled||disabled"
      [(ngModel)]="option.checked"
      (ngModelChange)="_optionChange()">
      <span>{{option.label}}</span>
    </tri-checkbox>`,
  providers          : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi      : true
    }
  ],
  host               : {
    '[class.ant-checkbox-group]': 'true'
  }
})
export class CheckboxGroupComponent implements AfterContentInit, ControlValueAccessor {
  _el: HTMLElement;
  _options: Array<any>;
  _prefixCls = 'ant-checkbox-group';
  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;
  @Input() disabled = false;
  @Input() type: string;

  _optionChange() {
    this.onChange(this._options);
  }

  constructor() {}

  ngAfterContentInit() {}

  writeValue(value: any): void {
    this._options = value;
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
