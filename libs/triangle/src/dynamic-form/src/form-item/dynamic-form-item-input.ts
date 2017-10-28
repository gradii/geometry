import { DynamicFormItem } from '../dynamic-form-item';
import { DynamicFormItemArgs } from './../dynamic-form-item';

export class DynamicFormItemInput extends DynamicFormItem {

  public readonly type = 'input';

  public constructor(options: DynamicFormItemArgs){
    super(options);
    this.init();
  }
}