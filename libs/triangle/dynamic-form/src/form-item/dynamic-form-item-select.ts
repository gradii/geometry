import { DynamicFormItem, LoopFn } from '../dynamic-form-item';

export class DynamicFormItemSelect extends DynamicFormItem {
  public readonly type = 'select';

  protected defaultOutputs = {
    searchChange: LoopFn,
    openChange  : LoopFn
  };

  public constructor(options) {
    super(options);
    this.init();
  }

  protected init() {
    super.init();
  }
}
