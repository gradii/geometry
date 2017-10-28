import { Component, Input } from '@angular/core';
import { FilterService } from './filter.service';
import { BaseFilterCellComponent, localizeOperators } from './base-filter-cell.component';
import { isNullOrEmptyString, extractFormat } from '../utils';
import { FilterComponent } from './filter-component.interface';
import { ColumnComponent } from '../columns/column.component';
import { CompositeFilterDescriptor, FilterDescriptor } from '@gradii/triangle/data-query';
const dateOperators = localizeOperators({
  filterEqOperator: 'eq',
  filterNotEqOperator: 'neq',
  filterAfterOrEqualOperator: 'gte',
  filterAfterOperator: 'gt',
  filterBeforeOrEqualOperator: 'lte',
  filterBeforeOperator: 'lt',
  filterIsNullOperator: 'isnull',
  filterIsNotNullOperator: 'isnotnull'
});

@Component({
  selector : 'tri-data-table-date-filter-cell',
  template: `
              <tri-data-table-filter-wrapper-cell
                [column]="column"
                [filter]="filter"
                [operators]="operators"
                [defaultOperator]="operator"
                [showOperators]="showOperators"
              >
                <!--<tri-datepicker-->
                  <!--nzFilterInput-->
                  <!--[value]="currentFilter?.value"-->
                  <!--[format]="format"-->
                  <!--[min]="min"-->
                  <!--[max]="max"-->
                <!--&gt;-->
                <!--</tri-datepicker>-->
                <tri-input></tri-input>
              </tri-data-table-filter-wrapper-cell>
            `
})
export class DateFilterCellComponent extends BaseFilterCellComponent implements FilterComponent {
  showOperators: boolean;

  column: ColumnComponent;

  filter: CompositeFilterDescriptor;

  operator: string;

  min: Date;

  max: Date;
  protected defaultOperators: Array<{
    text: string;
    value: string;
  }>;
  private _format;
  constructor(filterService: FilterService) {
    super(filterService);

    this.showOperators = true;

    this.operator = 'gte';
    this.defaultOperators = [
      { text: '等于', value: 'eq' },
      { text: '不等于', value: 'neq' },
      { text: '大于等于', value: 'gte' },
      { text: '大于', value: 'gt' },
      { text: '小于等于', value: 'lte' },
      { text: '小于', value: 'lt' },
      { text: '不存在', value: 'isnull' },
      { text: '存在', value: 'isnotnull' }
    ];
  }

  get currentFilter(): FilterDescriptor {
    return this.filterByField(this.column.field);
  }

  get format() {
    return !isNullOrEmptyString(this._format) ? this._format : this.columnFormat;
  }

  set format(value) {
    this._format = value;
  }
  private get columnFormat() {
    return this.column && !isNullOrEmptyString(this.column.format) ? extractFormat(this.column.format) : 'd';
  }

  get currentOperator() {
    return this.currentFilter ? this.currentFilter.operator : this.operator;
  }
}
