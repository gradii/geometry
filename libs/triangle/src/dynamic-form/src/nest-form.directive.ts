import { Directive, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';


@Directive({
  selector : 'tri-form[formGroup]',
  providers: [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NestFormDirective),
      multi      : true
    }
  ]
})
export class NestFormDirective implements ControlValueAccessor {

  get formValue() {
    return this.formGroupDirective.form.value;
  }

  onChange;
  onTouch;

  constructor(private formGroupDirective: FormGroupDirective) {
    formGroupDirective.form.valueChanges.subscribe(_ => {
      this.onChange(this.formValue);
    });
  }

  writeValue(value: any): void {
    this.formGroupDirective.form.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

}