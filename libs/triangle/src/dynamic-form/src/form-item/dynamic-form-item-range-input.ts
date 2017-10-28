import { DynamicFormItem } from '../dynamic-form-item';
import { DynamicFormItemArgs } from './../dynamic-form-item';

export class DynamicFormItemRangeInput extends DynamicFormItem {

  public readonly type = 'range-input';

  public constructor(options: DynamicFormItemArgs){
    super(options);
    this.init();
  }
}