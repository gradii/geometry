import { Component, Input } from '@angular/core';
import { isPresent, isNullOrEmptyString } from '../utils';
import { ColumnComponent } from '../columns/column.component';
import { CompositeFilterDescriptor } from '@gradii/triangle/data-query';
@Component({
  selector: '[triGridFilterCell]',
  template: `
              <ng-template [ngIf]="isFilterable">
                <ng-container [ngSwitch]="hasTemplate">
                  <ng-container *ngSwitchCase="false">
                    <ng-container triFilterHost [column]="column" [filter]="filter"></ng-container>
                  </ng-container>
                  <ng-container *ngSwitchCase="true">
                    <ng-template
                      *ngIf="column.filterCellTemplateRef"
                      [ngTemplateOutlet]="column.filterCellTemplateRef"
                      [ngTemplateOutletContext]="templateContext">
                    </ng-template>
                  </ng-container>
                </ng-container>
              </ng-template>
            `
})
export class FilterCellComponent {
  @Input() column: ColumnComponent;
  @Input() filter: CompositeFilterDescriptor;
  private _templateContext;
  constructor() {
    this._templateContext = {};
  }
  get templateContext() {
    this._templateContext.column = this.column;
    this._templateContext.filter = this.filter;
    // tslint:disable-next-line:no-string-literal
    this._templateContext['$implicit'] = this.filter;
    return this._templateContext;
  }
  get hasTemplate() {
    return isPresent(this.column.filterCellTemplateRef);
  }
  get isFilterable() {
    return isPresent(this.column) && !isNullOrEmptyString(this.column.field) && this.column.filterable;
  }
}
