import { DynamicFormItem, DynamicFormItemArgs } from '@gradii/triangle/dynamic-form/src/dynamic-form-item';
import { TemplateRef } from '@angular/core';
import { DynamicFormItemArray } from '@gradii/triangle/dynamic-form/src/dynamic-form-item-array';

export interface DynamicFormItemCustomArrayArgs extends DynamicFormItemArgs {
  templateRef: TemplateRef<any>;

  templateContext: any;
}

export class DynamicFormItemCustomArray extends DynamicFormItemArray {

  public type = 'custom-array';
  public templateRef;

  public templateContext;

  constructor(options: DynamicFormItemCustomArrayArgs) {
    super(options);

    this.templateRef     = options.templateRef;
    this.templateContext = options.templateContext;

    this.init();
  }
}