import { GroupDescriptor } from '@gradii/triangle/data-query';
import { Component, HostBinding, Input } from '@angular/core';
import { ColumnComponent } from '../columns/column.component';
import { columnsSpan } from '../helper/column-common';
import { GroupRow } from '../row-column/group-row';
import { GroupInfoService } from './group-info.service';
import { GroupsService } from './groups.service';

@Component({
  selector           : '[triGridGroupHeader]',
  preserveWhitespaces: false,
  template           : `
    <ng-template [ngIf]="!skipGroupDecoration">
      <td [class.tri-group-cell]="true" *ngFor="let g of prefixGroupCell(rowItem)"></td>
    </ng-template>
    <td [attr.colspan]="groupSpan(rowItem)">
      <p class="tri-reset">
        <ng-template [ngIf]="!skipGroupDecoration">
          <a href="#" tabindex="-1" (click)="toggleGroup(rowItem)"
             [ngClass]="groupButtonStyles(rowItem.index)">
          </a>
          <ng-template [ngIf]="!groupHeaderTemplate(rowItem)">
            {{groupTitle(rowItem)}}: {{rowItem.dataItem | valueOf:"value": formatForGroup(rowItem)}}
          </ng-template>
          <ng-template
            [ngTemplateOutlet]="groupHeaderTemplate(rowItem)"
            [ngTemplateOutletContext]="{
                            group: rowItem.dataItem,
                            aggregates: rowItem.dataItem?.aggregates,
                            value: rowItem.dataItem?.value,
                            field: rowItem.dataItem?.field,
                            $implicit: rowItem.dataItem | valueOf:'value': formatForGroup(rowItem)
                            }">
          </ng-template>
        </ng-template>
      </p>
    </td>
  `
})
export class GroupHeaderComponent {
  groupsService: GroupsService;
  groupInfoService: GroupInfoService;
  @Input() item: GroupRow;
  @Input() rowItem: GroupRow;
  @Input() skipGroupDecoration: boolean;
  @Input() hasDetails: boolean;
  @Input() columns: Array<ColumnComponent>;
  @Input() groups: Array<GroupDescriptor>;

  constructor(groupsService: GroupsService, groupInfoService: GroupInfoService) {
    this.groupsService = groupsService;
    this.groupInfoService = groupInfoService;
    this.skipGroupDecoration = false;
    this.hasDetails = false;
    this.columns = [];
    this.groups = [];
  }

  @HostBinding('class.tri-grouping-row')
  get groupItemClass(): boolean {
    return true;
  }

  prefixGroupCell(item: GroupRow): any[] {
    return new Array(item.level);
  }

  toggleGroup(item: GroupRow): boolean {
    //todo data-table fix me
    // this.groupsService.toggleRow(item.index, item.data);
    return false;
  }

  groupSpan(item: GroupRow):number {
    let columnCount = columnsSpan(this.columns);
    if (this.skipGroupDecoration) {
      return columnCount;
    }
    const groupCount = (this.groups || []).length;
    if (this.hasDetails) {
      columnCount++;
    }
    return groupCount + columnCount - item.level;
  }

  groupButtonStyles(groupIndex: any): any {
    const expanded = this.groupsService.isExpanded(groupIndex);
    return {'anticon-plus-square-o': expanded, 'anticon-minus-square-o': !expanded, 'anticon': true};
  }

  formatForGroup(item: GroupRow): string {
    return this.groupInfoService.formatForGroup(item);
  }

  groupTitle(item: GroupRow): string {
    return this.groupInfoService.groupTitle(item);
  }

  groupHeaderTemplate(item: GroupRow): any {
    return this.groupInfoService.groupHeaderTemplate(item);
  }
}
