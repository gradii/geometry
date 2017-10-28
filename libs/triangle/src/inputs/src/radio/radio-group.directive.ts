import { AfterContentInit, Directive, forwardRef } from '@angular/core';

import { RadioComponent, RadioOption } from './radio.component';
import { RadioButtonComponent } from './radio-button.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isPresent } from '@gradii/triangle/util';

@Directive({
  selector : 'tri-radio-group, [triRadioList], [tri-radio-list]',
  providers: [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupDirective),
      multi      : true
    }
  ],
})
export class RadioGroupDirective implements AfterContentInit, ControlValueAccessor {
  _value: string;
  _size: string;

  _disabled: boolean;

  // ngModel Access
  onChange: Function;
  onTouched: Function;

  radios: (RadioComponent | RadioButtonComponent | RadioOption)[] = [];

  addRadio(radio: RadioComponent | RadioButtonComponent | RadioOption) {
    this.radios.push(radio);
  }

  selectRadio(radio: RadioComponent | RadioButtonComponent | RadioOption | null) {
    if (isPresent(radio)) {
      this.updateValue(radio.value);
      this.onChange(radio.value);
    } else {
      this.updateValue(null);
      this.onChange(null);
    }
  }

  updateValue(value: any) {
    if (this._value === value) {
      return;
    }
    this._value = value;
    this.radios.forEach(item => {
      item.checked = item.value === this._value;
    });
  }

  ngAfterContentInit() {
    this.radios.forEach(item => {
      item.checked = item.value === this._value;
    });
  }

  writeValue(value: any): void {
    this.updateValue(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.radios.forEach(radio => {
      radio.disabled = isDisabled;
    });
  }
}
