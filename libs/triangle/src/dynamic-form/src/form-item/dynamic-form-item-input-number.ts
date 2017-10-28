import { DynamicFormItem } from '../dynamic-form-item';

export class DynamicFormItemInputNumber extends DynamicFormItem {

  public readonly type = 'input-number';

  public constructor(options){
    super(options);
    this.init();
  }
}