// tslint:disable:no-access-missing-member
import { CompositeFilterDescriptor, FilterDescriptor } from '@gradii/triangle/data-query';
import { Component, Input } from '@angular/core';
import { ColumnComponent } from '../column.component';
import { FilterService } from './filter.service';
import { BaseFilterCellComponent } from './base-filter-cell.component';
@Component({
  selector : 'tri-data-table-autocomplete-filter-cell',
  template: `
              <tri-data-table-filter-wrapper-cell
                [column]="column"
                [filter]="filter"
                [operators]="operators"
                [showOperators]="showOperators">
                <tri-dropdown>
                  <ul tri-menu>
                  <!--nzFilterInput-->
                  <!--[data]="data"-->
                  <!--[valueField]="valueField"-->
                  <!--[value]="currentFilter?.value"-->
                    <li tri-menu-item *ngFor="let item of data; let valueField = valueField; ">{{item[valueField]}}</li>
                  </ul>
                </tri-dropdown>
              </tri-data-table-filter-wrapper-cell>
            `
})
export class AutoCompleteFilterCellComponent extends BaseFilterCellComponent {
  @Input() showOperators: boolean;
  @Input() column: ColumnComponent;
  @Input() filter: CompositeFilterDescriptor;
  @Input() data: any[];
  protected defaultOperators: Array<{
    text: string;
    value: string;
  }>;
  private _valueField;
  constructor(filterService: FilterService, column: ColumnComponent) {
    super(filterService);
    this.showOperators = true;
    this.defaultOperators = [
      { text: '包含', value: 'contains' },
      { text: '不包含', value: 'doesnotcontain' },
      { text: '等于', value: 'eq' },
      { text: '不等于', value: 'neq' },
      { text: '开始于', value: 'startswith' },
      { text: '结束于', value: 'endswith' },
      { text: '不存在', value: 'isnull' },
      { text: '存在', value: 'isnotnull' },
      { text: '为空', value: 'isempty' },
      { text: '不为空', value: 'isnotempty' }
    ];
    this.column = column;
  }
  @Input()
  get valueField(): string {
    return this._valueField ? this._valueField : this.column.field;
  }
  set valueField(value) {
    this._valueField = value;
  }
  get currentFilter(): FilterDescriptor {
    return this.filterByField(this.column.field);
  }
  get currentOperator(): string {
    return this.currentFilter ? <string>this.currentFilter.operator : 'contains';
  }
}
