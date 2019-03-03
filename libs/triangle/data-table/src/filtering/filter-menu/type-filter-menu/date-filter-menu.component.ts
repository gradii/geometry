import { CompositeFilterDescriptor, FilterDescriptor } from '@gradii/triangle/data-query';
import { LocaleService } from '@gradii/triangle/locale';
import { isNullOrEmptyString, isPresent } from '@gradii/triangle/util';
import { Component, HostBinding, Input } from '@angular/core';
import { ColumnComponent } from '../../../columns/column.component';
import { extractFormat } from '../../../utils';
import { BaseFilterCellComponent } from '../../base-filter-cell.component';
import { FilterService } from '../../filter.service';

@Component({
  selector: 'tri-data-table-date-filter-menu',
  template: `
    <tri-data-table-date-filter-menu-input
      class="mb-2"
      [currentFilter]="firstFilter"
      [operators]="operators"
      [filterService]="filterService"
      [column]="column"
      [filter]="filter"
      [format]="format"
      [min]="min"
      [max]="max"
    >
    </tri-data-table-date-filter-menu-input>
    <tri-select 
      *ngIf="extra"
      class="mb-2 ant-filter-and"
      [options]="logicOperators"
      [ngModel]="filter?.logic"
    >
    </tri-select>
    <tri-data-table-date-filter-menu-input
      class="mb-2"
      *ngIf="extra"
      [operators]="operators"
      [currentFilter]="secondFilter"
      [filterService]="filterService"
      [column]="column"
      [filter]="filter"
      [format]="format"
      [min]="min"
      [max]="max"
    >
    </tri-data-table-date-filter-menu-input>
  `
})
export class DateFilterMenuComponent extends BaseFilterCellComponent {
  logicOperators: Array<{
    label: string;
    value: 'and' | 'or';
  }> = [{label: 'And', value: 'and'}, {label: 'Or', value: 'or'}];

  @HostBinding('class.tri-filtercell')
  get hostClasses(): boolean {
    return false;
  }

  get currentFilter(): FilterDescriptor {
    return this.filterByField(this.column.field);
  }

  get columnFormat() {
    return this.column && !isNullOrEmptyString(this.column.format) ? extractFormat(this.column.format) : 'd';
  }

  get currentOperator() {
    return this.currentFilter ? this.currentFilter.operator : this.operator;
  }

  @Input() column: ColumnComponent;
  @Input() filter: CompositeFilterDescriptor = {filters: [], logic: 'and'};
  @Input() operator: string;
  @Input() format;
  @Input() min;
  @Input() max;
  @Input() extra: boolean = true;

  filterService: FilterService;

  constructor(protected localization: LocaleService) {
    // super(null, localization);
    super(null);
  }

  get firstFilter() {
    if (isPresent(this.filter) && isPresent(this.filter.filters) && this.filter.filters.length) {
      return this.filter.filters[0];
    } else {
      return this.insertDefaultFilter(0, {
        field   : this.column!.field,
        operator: this.currentOperator
      });
    }
  }

  get secondFilter() {
    if (isPresent(this.filter) && isPresent(this.filter.filters) && this.filter.filters.length > 1) {
      return this.filter.filters[1];
    } else {
      return this.insertDefaultFilter(1, {
        field   : this.column!.field,
        operator: this.currentOperator
      });
    }
  }

  logicChange(value) {
    this.filter.logic = value;
  }

  insertDefaultFilter(index, filter) {
    this.filter = this.filter || {filters: [], logic: 'and'};
    this.filter.filters[index] = filter;
    return filter;
  }
}
