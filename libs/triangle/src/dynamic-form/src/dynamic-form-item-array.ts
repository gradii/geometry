import { FormArray } from '@angular/forms';
import { DynamicFormItemArgs } from './dynamic-form-item';

export const LoopFn = () => {};

export class DynamicFormItemArray extends FormArray {

  public readonly type: string = 'array';

  public label;

  public name;

  protected options: any;

  public constructor(options: DynamicFormItemArgs) {
    super([], options.validatorOrOpts);
    const {
      label,
      name,
      validatorOrOpts
    } = options;

    this.label = label;
    this.name = name;
    this.options = options;
  }

  protected init() {

  }

  /**
   *
   * @param schema
   */
  public parseSchema(schema) {

  }

  public toSchema() {

  }

}