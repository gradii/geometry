import { Component, Input } from '@angular/core';
import { columnsToRender } from './helper/column-common';
import { ColumnComponent } from './columns/column.component';
import { GroupDescriptor } from '@gradii/triangle/data-query';
import { DetailTemplateDirective } from './table-shared/detail-template.directive';
import { ColumnBase } from './columns/column-base';
@Component({
  selector: '[triGridColGroup], [tri-grid-col-group]',
  template: `
              <ng-template [ngIf]="true">
                <col [class.ant-group-col]="true" *ngFor="let g of groups"/>
                <col [class.ant-hierarchy-col]="true" *ngIf="detailTemplate?.templateRef"/>
                <col *ngFor="let column of columnsToRender" [style.width.px]="column.width"/>
              </ng-template>
            `
})
export class ColGroupComponent {
  @Input() columns: ColumnComponent[];
  @Input() groups: GroupDescriptor[];
  @Input() detailTemplate: DetailTemplateDirective;
  constructor() {
    this.columns = [];
    this.groups = [];
  }
  get columnsToRender(): ColumnBase[] {
    return columnsToRender(this.columns);
  }
}
