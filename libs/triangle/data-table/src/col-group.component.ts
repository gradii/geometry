import { GroupDescriptor } from '@gradii/triangle/data-query';
import { Component, Input } from '@angular/core';
import { ColumnBase } from './columns/column-base';
import { ColumnComponent } from './columns/column.component';
import { columnsToRender } from './helper/column-common';
import { DetailTemplateDirective } from './table-shared/detail-template.directive';

@Component({
  selector: '[triGridColGroup], [tri-grid-col-group]',
  template: `
              <ng-template [ngIf]="true">
                <col [class.tri-group-col]="true" *ngFor="let g of groups"/>
                <col [class.tri-hierarchy-col]="true" *ngIf="detailTemplate?.templateRef"/>
                <col *ngFor="let column of columnsToRender" 
                     [style.width.px]="column.width" 
                     [style.minWidth.px]="column.minWidth" 
                     [style.maxWidth.px]="column.maxWidth"/>
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
