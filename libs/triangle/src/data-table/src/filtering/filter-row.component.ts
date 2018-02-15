import { Component, Input, HostBinding } from '@angular/core';
import { DetailTemplateDirective } from '../table-shared/detail-template.directive';
import { CompositeFilterDescriptor, GroupDescriptor } from '@gradii/triangle/data-query';
import { ColumnBase } from '../column-base';
@Component({
  selector: '[triGridFilterRow]',
  template: `
              <th
                [class.ant-group-cell]="true"
                *ngFor="let g of groups">
              </th>
              <th
                [class.ant-hierarchy-cell]="true"
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
  @HostBinding('class.ant-filter-row') filterRowClass: boolean;
  constructor() {
    this.columns = [];
    this.groups = [];
    this.filterRowClass = true;
  }
}
