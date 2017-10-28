import { DynamicFormItem } from '../dynamic-form-item';

export class DynamicFormItemRadio extends DynamicFormItem {

  public readonly type = 'radio';

  public constructor(options){
    super(options);
    this.init();
  }
}