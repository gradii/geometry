import { Component } from '@angular/core';
import { FormField } from './form-field';
import { FormFieldBase } from './form-field.base';


@Component({
  selector: 'input-form-field',
  template: `
    <input type="text"
           [placeholder]="formField.name"
           [formControl]="formField.formControl"
    />
  `
})
export class InputFormFieldComponent extends FormFieldBase {
  public formField!: FormField;

  constructor() {
    super();
  }

  ngOnInit() {
    console.log(this.formField);
  }
}
