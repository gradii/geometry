import { CompositeFilterDescriptor } from '@gradii/triangle/data-query';
import { isNullOrEmptyString, isPresent } from '@gradii/triangle/util';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Self, SkipSelf } from '@angular/core';
import { ColumnComponent } from '../../columns/column.component';
import { filtersByField, removeFilter } from '../base-filter-cell.component';
import { FilterService } from '../filter.service';

const isNoValueOperator = function (operator) {
  return operator === 'isnull' || operator === 'isnotnull' || operator === 'isempty' || operator === 'isnotempty';
};
const validFilters = function ({value, operator}) {
  return !isNullOrEmptyString(value) || isNoValueOperator(operator);
};
const trimFilters = function (filter) {
  filter.filters = filter.filters.filter(validFilters);
  return filter;
};
const findParent = function (filters, field, parent?) {
  return filters.reduce(function (acc, filter) {
    if (filter.filters) {
      return findParent(filter.filters, field, filter);
    } else if (filter.field === field) {
      return parent;
    }
    return acc;
  }, undefined);
};
const parentLogicOfDefault = function (filter, field, def = 'and') {
  const parent = findParent((filter || {}).filters || [], field);
  return isPresent(parent) ? parent.logic : def;
};

@Component({
  providers: [FilterService],
  selector : 'tri-data-table-filter-menu-container',
  template : `
    <form tri-form (submit)="$event.preventDefault();submit();" (reset)="reset()"
          layout="inline"
          class="tri-filter-menu tri-popup tri-group tri-reset tri-state-border-up">
      <div class="tri-filter-menu-container">
        <ng-container [ngSwitch]="hasTemplate">
          <ng-template [ngSwitchCase]="false">
            <ng-container [ngSwitch]="componentFilterType">
              <ng-template ngSwitchCase="date">
                <tri-data-table-date-filter-menu [column]="column"
                                                 [filter]="childFilter"
                >
                </tri-data-table-date-filter-menu>
              </ng-template>
              <ng-template ngSwitchCase="numeric">
                <tri-data-table-numeric-filter-menu [column]="column"
                                                    [filterService]="childService"
                                                    [filter]="childFilter">
                </tri-data-table-numeric-filter-menu>
              </ng-template>
              <ng-template ngSwitchCase="boolean">
                <tri-data-table-boolean-filter-menu [column]="column"
                                                    [filterService]="childService"
                                                    [filter]="childFilter">
                </tri-data-table-boolean-filter-menu>
              </ng-template>
              <ng-template ngSwitchDefault><!-- default string -->
                <tri-data-table-string-filter-menu [column]="column"
                                                   [filterService]="childService"
                                                   [filter]="childFilter">
                </tri-data-table-string-filter-menu>
              </ng-template>
            </ng-container>

          </ng-template>
          <ng-template [ngSwitchCase]="true">
            <ng-template
              *ngIf="column.filterMenuTemplateRef"
              [ngTemplateOutlet]="column.filterMenuTemplateRef"
              [ngTemplateOutletContext]="templateContext">
            </ng-template>
          </ng-template>
        </ng-container>

        <div tri-row>
          <div tri-col [span]="24" style="text-align: right;">
            <button tri-button [attr.type]="'reset'">Clear</button>
            <button tri-button type="primary" [disabled]="disabled">Filter</button>
          </div>
        </div>
      </div>
    </form>
  `
})
export class FilterMenuContainerComponent implements OnInit, OnDestroy {
  private _childFilter;
  private subscription;
  private _templateContext: any = {};

  get childFilter(): CompositeFilterDescriptor {
    if (!isPresent(this._childFilter)) {
      this._childFilter = {
        filters: filtersByField(this.filter, this.column!.field),
        logic  : parentLogicOfDefault(this.filter, this.column!.field)
      };
    }
    return this._childFilter;
  }

  get disabled(): boolean {
    return !this.childFilter.filters.some(validFilters);
  }

  get templateContext(): any {
    this._templateContext.column = this.column;
    this._templateContext.filter = this.childFilter;
    this._templateContext.filterService = this.childService;
    this._templateContext['$implicit'] = this.childFilter;
    return this._templateContext;
  }

  get hasTemplate(): boolean {
    return isPresent(this.column) && isPresent(this.column.filterMenuTemplateRef);
  }

  @Input() column: ColumnComponent;
  @Input() filter: CompositeFilterDescriptor;

  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(@SkipSelf() public parentService: FilterService,
              @Self() public childService: FilterService) {
  }

  submit(): boolean {
    const filter = trimFilters(this.childFilter);
    if (filter.filters.length) {
      const root = this.filter || {
        filters: [],
        logic  : 'and'
      };
      removeFilter(root, this.column.field);
      root.filters.push(filter);
      this.parentService.filter(root);
    }
    this.close.emit();
    return false;
  }

  reset(): void {
    const root = this.filter || {
      filters: [],
      logic  : 'and'
    };
    removeFilter(root, this.column.field);
    this.parentService.filter(root);
    this.close.emit();
  }

  public get componentFilterType() {
    if (isPresent(this.column) && !isNullOrEmptyString(this.column.filter)) {
      return this.column.filter;
    }
    return 'string';
  }

  ngOnInit(): void {
    this.subscription = this.childService.changes.subscribe(filter => {
      this._childFilter = filter;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
