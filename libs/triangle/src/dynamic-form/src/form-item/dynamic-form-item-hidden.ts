import { DynamicFormItem } from '../dynamic-form-item';

export class DynamicFormItemHidden extends DynamicFormItem {

  public readonly type = 'hidden';

  public constructor(options){
    super(options);
    this.init();
  }
}