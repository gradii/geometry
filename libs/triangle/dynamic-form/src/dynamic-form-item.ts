import { isObservable, isPromise } from '@gradii/triangle/util';
import { FormControl } from '@angular/forms';


export interface DynamicFormItemArgs {
  label: string;
  value: any;
  name: string;
  required?: boolean;
  tooltip?: string;
  inputs?: { [key: string]: any };
  outputs?: { [key: string]: any };
  validatorOrOpts?: any;
}

export const LoopFn = () => {};

export class DynamicFormItem extends FormControl {

  public readonly type: string;

  public label;
  public name;

  public tooltip;
  public required;

  public inputs: any;
  public outputs: any;

  protected defaultInputs: { [key: string]: any } = {};
  protected defaultOutputs: { [key: string]: any } = {};

  public constructor({
                       label,
                       value,
                       name,
                       tooltip,
                       required,
                       inputs,
                       outputs,
                       validatorOrOpts
                     }: DynamicFormItemArgs) {
    super(value, validatorOrOpts);

    this.label = label;
    this.name = name;
    this.tooltip = tooltip;
    this.required = !!required;
    this.inputs = inputs || {};
    this.outputs = outputs || {};
  }

  protected init() {
    this.handleDefaultInputs();
    this.handleDefaultOutput();
    this.handleInputs();
    this.handleOutputs();
  }

  protected handleDefaultInputs() {
    this.inputs = Object.assign(this.defaultInputs, this.inputs);
  }

  protected handleDefaultOutput() {
    this.outputs = Object.assign(this.defaultOutputs, this.outputs);
  }

  protected handleInputs() {
    for (let [key, input] of Object.entries(this.inputs)) {
      if (isPromise(input)) {
        input.then(_ => {
          this.inputs[key] = _;
        });
      } else if (isObservable(input)) {
        input.subscribe(_ => {
          this.inputs[key] = _;
        });
      }
    }
  }

  protected handleOutputs() {

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