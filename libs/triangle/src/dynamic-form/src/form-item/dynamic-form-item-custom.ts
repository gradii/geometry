import { DynamicFormItem, DynamicFormItemArgs } from '@gradii/triangle/dynamic-form/src/dynamic-form-item';
import { TemplateRef } from '@angular/core';

export interface DynamicFormItemCustomArgs extends DynamicFormItemArgs {
  templateRef: TemplateRef<any>;

  templateContext: any;
}

export class DynamicFormItemCustom extends DynamicFormItem {

  public type = 'custom';
  public templateRef;

  public templateContext;

  constructor(options: DynamicFormItemCustomArgs) {
    super(options);

    this.templateRef     = options.templateRef;
    this.templateContext = options.templateContext;

    this.init();
  }
}