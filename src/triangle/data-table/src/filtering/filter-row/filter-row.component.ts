import { Component, HostBinding, Input } from '@angular/core';
import { CompositeFilterDescriptor, GroupDescriptor } from '@gradii/triangle/data-query';
import { ColumnBase } from '../../columns/column-base';
import { DetailTemplateDirective } from '../../table-shared/detail-template.directive';

@Component({
  selector           : '[triGridFilterRow]',
  preserveWhitespaces: false,
  template           : `
              <th
                [class.tri-group-cell]="true"
                *ngFor="let g of groups">
              </th>
              <th
                [class.tri-hierarchy-cell]="true"
                *ngIf="detailTemplate?.templateRef">
              </th>
              <th *ngFor="let column of columns;" triGridFilterCell [column]="column" [filter]="filter"></th>
            `
})
export class FilterRowComponent {
  @Input() columns: ColumnBase[];
  @Input() filter: CompositeFilterDescriptor;
  @Input() groups: GroupDescriptor[];
  @Input() detailTemplate: DetailTemplateDirective;
  @HostBinding('class.tri-filter-row') filterRowClass: boolean;

  constructor() {
    this.columns = [];
    this.groups = [];
    this.filterRowClass = true;
  }
}
