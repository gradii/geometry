import { Component } from '@angular/core';
import { CompositeFilterDescriptor, FilterDescriptor } from '@gradii/triangle/data-query';
import { ColumnComponent } from '../column.component';
import { BaseFilterCellComponent } from './base-filter-cell.component';
import { FilterService } from './filter.service';

@Component({
  selector : 'tri-data-table-string-filter-cell',
  template: `
              <tri-data-table-filter-wrapper-cell
                [column]="column"
                [filter]="filter"
                [operators]="operators"
                [defaultOperator]="operator"
                [showOperators]="showOperators">
                <input class="ant-textbox" triFilterInput [ngModel]="currentFilter?.value"/>
              </tri-data-table-filter-wrapper-cell>
            `
})
export class StringFilterCellComponent extends BaseFilterCellComponent {
  showOperators: boolean;

  column: ColumnComponent;

  filter: CompositeFilterDescriptor;

  operator: string;
  protected defaultOperators: Array<{
    text: string;
    value: string;
  }>;
  constructor(filterService: FilterService) {
    super(filterService);

    this.showOperators = true;

    this.operator = 'contains';
    this.defaultOperators = [
      { text: 'eq', value: 'eq' },
      { text: 'neq', value: 'neq' },
      { text: 'contains', value: 'contains' },
      { text: 'doesnotcontain', value: 'doesnotcontain' },
      { text: 'startswith', value: 'startswith' },
      { text: 'endswith', value: 'endswith' },
      { text: 'isnull', value: 'isnull' },
      { text: 'isnotnull', value: 'isnotnull' },
      { text: 'isempty', value: 'isempty' },
      { text: 'isnotempty', value: 'isnotempty' }
    ];
  }

  get currentFilter(): FilterDescriptor {
    return this.filterByField(this.column.field);
  }

  get currentOperator() {
    return this.currentFilter ? this.currentFilter.operator : this.operator;
  }
}
