import {ContentChildren, QueryList, HostBinding, AfterContentInit, OnDestroy} from '@angular/core';
import {CompositeFilterDescriptor, FilterDescriptor, isCompositeFilterDescriptor} from '@gradii/triangle/data-query';
import {map} from "rxjs/operators/map";
import {isPresent, observe} from '../utils';
import {FilterOperatorBase, toJSON} from './operators/filter-operator.base';
import {FilterService} from './filter.service';

const flatten: any             = filter => {
  if (isPresent(filter.filters)) {
    return filter.filters.reduce(
      (acc, curr) => acc.concat(isCompositeFilterDescriptor(curr) ? flatten(curr) : [curr]),
      []
    );
  }
  return [];
};
const trimFilterByField        = (filter, field) => {
  if (isPresent(filter) && isPresent(filter.filters)) {
    filter.filters = filter.filters.filter(x => {
      if (isCompositeFilterDescriptor(x)) {
        trimFilterByField(x, field);
        return x.filters.length;
      } else {
        return x.field !== field;
      }
    });
  }
};
export const localizeOperators = operators => localization =>
  Object.keys(operators).map(key => ({
    text : localization.get(key),
    value: operators[key]
  }));

export abstract class BaseFilterCellComponent implements AfterContentInit, OnDestroy {
  protected filterService: FilterService;
  @ContentChildren(FilterOperatorBase) operatorList: QueryList<FilterOperatorBase>;
            filter: CompositeFilterDescriptor;
  protected defaultOperators: Array<{
    text: string;
    value: string;
  }>;
  private _operators;
  private operationListSubscription;

  constructor(filterService: FilterService) {
    this.filterService = filterService;
    this.operatorList  = new QueryList<FilterOperatorBase>();
  }

  @HostBinding('class.ant-filtercell')
  get hostClasses() {
    return true;
  }

  get operators(): Array<{
    text: string;
    value: string;
  }> {
    return this._operators.length ? this._operators : this.defaultOperators;
  }

  set operators(values) {
    this._operators = values;
  }

  ngAfterContentInit() {
    this.operationListSubscription = observe(this.operatorList)
      .pipe(
        map(toJSON)
      )
      .subscribe(x => {
        this.operators = x;
      });
  }

  ngOnDestroy() {
    if (this.operationListSubscription) {
      this.operationListSubscription.unsubscribe();
    }
  }

  protected filterByField(field: string): FilterDescriptor {
    const currentFilter = this.filtersByField(field)[0];
    return currentFilter;
  }

  protected filtersByField(field: string): FilterDescriptor[] {
    return flatten(this.filter || {}).filter(x => x.field === field);
  }

  protected removeFilter(field: string): CompositeFilterDescriptor {
    trimFilterByField(this.filter, field);
    return this.filter;
  }

  protected updateFilter(filter: FilterDescriptor): CompositeFilterDescriptor {
    const root: CompositeFilterDescriptor = this.filter || {
      filters: [],
      logic  : 'and'
    };
    const currentFilter                   = flatten(root).filter(x => x.field === filter.field)[0];
    if (!isPresent(currentFilter)) {
      root.filters.push(filter);
    } else {
      Object.assign(currentFilter, filter);
    }
    return root;
  }

  protected applyFilter(filter: CompositeFilterDescriptor): void {
    this.filterService.filter(filter);
  }
}
