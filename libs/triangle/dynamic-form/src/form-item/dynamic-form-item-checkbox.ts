import { DynamicFormItem, DynamicFormItemArgs } from '../dynamic-form-item';

export interface DynamicFormItemCheckboxArgs extends DynamicFormItemArgs {
  span?: string;
}

export class DynamicFormItemCheckbox extends DynamicFormItem {
  public type = 'checkbox';

  public span: string;

  public constructor({label, value, name, span, validatorOrOpts}: DynamicFormItemCheckboxArgs) {
    super({
      label,
      value,
      name,
      validatorOrOpts
    });

    this.span = span;
    this.init();
  }
}
