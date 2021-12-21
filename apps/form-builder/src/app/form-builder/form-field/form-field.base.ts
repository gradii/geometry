import { Injectable } from '@angular/core';
import { FormField } from './form-field';

@Injectable()
export class FormFieldBase {
  public formField!: FormField;
}
