import { DynamicFormItem } from '../dynamic-form-item';
import { DynamicFormItemArgs } from '../dynamic-form-item';
import { LoopFn } from '../dynamic-form-item';

export interface DynamicFormItemCheckboxDataTableArgs extends DynamicFormItemArgs {
  span?: string
}

export class DynamicFormItemCheckboxDataTable extends DynamicFormItem {

  public type = 'checkbox-data-table';

//  defaultInputs = {
//    rowClass: LoopFn,
//    rowSelected: LoopFn
//  };

  protected defaultOutputs = {
    filterChange      : LoopFn,
    pageChange        : LoopFn,
    groupChange       : LoopFn,
    sortChange        : LoopFn,
    selectionChange   : LoopFn,
    dataStateChange   : LoopFn,
    groupExpand       : LoopFn,
    groupCollapse     : LoopFn,
    detailExpand      : LoopFn,
    detailCollapse    : LoopFn,
    edit              : LoopFn,
    cancel            : LoopFn,
    save              : LoopFn,
    remove            : LoopFn,
    add               : LoopFn,
    selectedKeysChange: LoopFn,
  };

  public constructor(options) {
    super(options);
    this.init();
  }
}
