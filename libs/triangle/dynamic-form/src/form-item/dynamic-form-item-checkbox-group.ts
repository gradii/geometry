import { DynamicFormItem } from '../dynamic-form-item';

export class DynamicFormItemCheckboxGroup extends DynamicFormItem {
  public type = 'checkbox-group';

  public constructor(options) {
    super(options);
    this.init();
  }
}
