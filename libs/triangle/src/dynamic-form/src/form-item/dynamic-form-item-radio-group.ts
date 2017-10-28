import { DynamicFormItem } from '../dynamic-form-item';

export class DynamicFormItemRadioGroup extends DynamicFormItem {

  public readonly type = 'radio-group';

  public constructor(options){
    super(options);
    this.init();
  }
}