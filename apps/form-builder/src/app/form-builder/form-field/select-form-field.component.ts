import { Component } from '@angular/core';
import { FormFieldBase } from './form-field.base';


@Component({
  selector: 'input-form-field',
  template: `
    <select>
      <option value="">value label</option>
    </select>
  `
})
export class SelectFormFieldComponent extends FormFieldBase {


  constructor() {
    super();
  }
}
