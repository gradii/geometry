import { FormGroup } from '@angular/forms';
import { DynamicFormItem } from './dynamic-form-item';

export class FormSchema {
  private _dynamicFormItemList = [];

  private _formGroup: FormGroup;

  public constructor(formSchema: DynamicFormItem[] = []) {
    this._dynamicFormItemList = formSchema;
    this._formGroup = this.generateFormGroup();
  }

  public get formGroup() {
    return this._formGroup;
  }

  public generateFormGroup() {
    const _controls = {};

    this._dynamicFormItemList.forEach((dynamicFormItem, index) => {
      _controls[dynamicFormItem.name] = dynamicFormItem;
    });

    return new FormGroup(_controls);
  }

  public addFormItem(formItem) {
    this._dynamicFormItemList.push(formItem);
    this._formGroup = this.generateFormGroup();
  }

  public removeFormItem(formName) {
    this._dynamicFormItemList = this._dynamicFormItemList.filter(formItem => formName !== formItem.name);
  }

  public * [Symbol.iterator]() {
    for (let i of this._dynamicFormItemList) {
      yield i;
    }
  }
}
