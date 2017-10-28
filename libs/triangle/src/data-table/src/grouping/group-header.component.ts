import { GroupsService } from './groups.service';
import { GroupInfoService } from './group-info.service';
import { ColumnComponent } from '../columns/column.component';
import { Component, HostBinding, Input } from '@angular/core';
import { columnsSpan } from '../helper/column-common';
import { GroupItem } from '../data-collection/data.iterators';
import { GroupDescriptor } from '@gradii/triangle/data-query';
@Component({
  selector: '[triGridGroupHeader]',
  template: `
              <ng-template [ngIf]="!skipGroupDecoration">
                <td [class.ant-group-cell]="true" *ngFor="let g of prefixGroupCell(item)"></td>
              </ng-template>
              <td [attr.colspan]="groupSpan(item)">
                <p class="ant-reset">
                  <ng-template [ngIf]="!skipGroupDecoration">
                    <a href="#" tabindex="-1" (click)="toggleGroup(item)"
                       [ngClass]="groupButtonStyles(item.index)">
                    </a>
                    <ng-template [ngIf]="!groupHeaderTemplate(item)">
                      {{groupTitle(item)}}: {{item.data | valueOf:"value": formatForGroup(item)}}
                    </ng-template>
                    <ng-template
                      triTemplateContext
                      [templateContext]="{
                            templateRef: groupHeaderTemplate(item),
                            group: item.data,
                            aggregates: item.data?.aggregates,
                            value: item.data?.value,
                            field: item.data?.field,
                            $implicit: item.data
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
  @Input() item: GroupItem;
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
  @HostBinding('class.ant-grouping-row')
  get groupItemClass(): boolean {
    return true;
  }
  prefixGroupCell(item: GroupItem): any[] {
    return new Array(item.level);
  }
  toggleGroup(item: GroupItem): boolean {
    this.groupsService.toggleRow(item.index, item.data);
    return false;
  }
  groupSpan(item: GroupItem): number {
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
  groupButtonStyles(groupIndex: string): any {
    const expanded = this.groupsService.isExpanded(groupIndex);
    return { 'ant-i-collapse': expanded, 'ant-i-expand': !expanded, 'ant-icon': true };
  }
  formatForGroup(item: GroupItem): string {
    return this.groupInfoService.formatForGroup(item);
  }
  groupTitle(item: GroupItem): string {
    return this.groupInfoService.groupTitle(item);
  }
  groupHeaderTemplate(item: GroupItem): any {
    return this.groupInfoService.groupHeaderTemplate(item);
  }
}
