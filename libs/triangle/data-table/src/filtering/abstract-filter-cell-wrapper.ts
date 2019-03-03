import { isBlank, isNullOrEmptyString, isPresent } from '@gradii/triangle/util';
import { Input } from '@angular/core';
import { CompositeFilterDescriptor, FilterDescriptor } from '@gradii/triangle/data-query';
import { ColumnComponent } from '../../columns/column.component';
import { BaseFilterCellComponent } from '../base-filter-cell.component';
import { FilterService } from '../filter.service';

export class AbstractFilterCellWrapper {
  @Input() showOperators: boolean = true;
  @Input() operators: Array<{
    label: string;
    value: string;
  }> = [];
  @Input() column: ColumnComponent;
  @Input() filter: CompositeFilterDescriptor;
  // @ContentChild(FilterInputDirective) input: FilterInputDirective;
  private _defaultOperator;
  private _operator;
  private changeSubscription;

  constructor(filterService: FilterService) {
    super(filterService);
  }

  get currentFilter(): FilterDescriptor {
    return this.filterByField(this.column.field);
  }

  get showButton() {
    const filter = this.currentFilter;
    return isPresent(filter) && !isBlank(filter.value);
  }

  @Input()
  get currentOperator() {
    const filter = this.currentFilter;
    if (!this._operator) {
      this._operator = filter ? filter.operator : this.defaultOperator;
    }
    return this._operator;
  }

  set currentOperator(value) {
    this._operator = value;
    if (value === 'isnull' || value === 'isnotnull' || value === 'isempty' || value === 'isnotempty') {
      this.applyNoValueFilter(value);
    } else if (!isBlank(value) && isPresent(this.currentFilter)) {
      this.onChange(this.currentFilter.value);
    }
  }

  @Input()
  get defaultOperator() {
    if (!isNullOrEmptyString(this._defaultOperator)) {
      return this._defaultOperator;
    } else if (this.operators && this.operators.length) {
      return this.operators[0].value;
    }
    return 'eq';
  }

  set defaultOperator(value) {
    this._defaultOperator = value;
  }

  onChange(value) {
    this.applyFilter(
      isBlank(value)
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
          field   : this.column.field,
          operator: this.currentOperator,
          value
        })
    );
  }

  onClear() {
    this.onChange(null);
  }

  protected applyNoValueFilter(operator: string): void {
    this.applyFilter(
      this.updateFilter({
        field: this.column.field,
        operator,
        value: null
      })
    );
  }
}
