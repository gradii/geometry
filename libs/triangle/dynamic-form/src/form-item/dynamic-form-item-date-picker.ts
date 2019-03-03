import { DynamicFormItem } from '../dynamic-form-item';

export class DynamicFormItemDatePicker extends DynamicFormItem {
  public readonly type = 'data-picker';

  public constructor(options) {
    super(options);
    this.init();
  }
}
