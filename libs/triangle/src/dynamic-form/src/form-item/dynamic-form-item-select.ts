import { DynamicFormItem } from '../dynamic-form-item';
import { LoopFn } from '../dynamic-form-item';

export class DynamicFormItemSelect extends DynamicFormItem {

  public readonly type = 'select';

  protected defaultOutputs = {
    searchChange: LoopFn,
    openChange: LoopFn
  };

  public constructor(options) {
    super(options);
    this.init();
  }

  protected init() {
    super.init();
  }

}