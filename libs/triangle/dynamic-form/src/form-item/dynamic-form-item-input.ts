import { DynamicFormItem } from '../dynamic-form-item';
import { DynamicFormItemArgs } from './../dynamic-form-item';

export interface DynamicFormItemInputArgs extends DynamicFormItemArgs {
  addOnBefore?: string;
  addOnAfter?: string
}

export class DynamicFormItemInput extends DynamicFormItem {

  public readonly type = 'input';
  private addOnBefore: string;
  private addOnAfter: string;

  public constructor(options: DynamicFormItemInputArgs) {
    super(options);
    this.addOnBefore = options.addOnBefore;
    this.addOnAfter = options.addOnAfter;
    this.init();
  }
}