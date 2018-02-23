import { GroupDescriptor } from '@gradii/triangle/data-query';
import { isPresent } from '@gradii/triangle/util';
import { Component, Input, OnChanges } from '@angular/core';
import { ColumnBase, isCheckboxColumn, isSpanColumn } from '../columns/column-base';
import { GroupFooterItem, GroupItem, Item } from '../data-collection/data.iterators';
import { NoRecordsTemplateDirective } from '../directive/no-records-template.directive';
import { GroupsService } from '../grouping/groups.service';
import { columnsSpan, columnsToRender } from '../helper/column-common';
import { RowClassFn } from '../row-class';
import { SelectableSettings } from '../selection/selectable-settings';
import { ChangeNotificationService } from '../service/change-notification.service';
import { DetailsService } from '../service/details.service';
import { EditService } from '../service/edit.service';
import { DetailTemplateDirective } from '../table-shared/detail-template.directive';
import { isChanged } from '../utils';

@Component({
  selector: '[triGridTableBody]',
  template: `
    <ng-template [ngIf]="editService.hasNewItem">
      <tr class="ant-grid-add-row ant-grid-edit-row ant-table-row">
        <ng-template [ngIf]="!skipGroupDecoration">
          <td [class.ant-group-cell]="true" *ngFor="let g of groups"></td>
        </ng-template>
        <td [class.ant-hierarchy-cell]="true"
            *ngIf="detailTemplate?.templateRef">
        </td>
        <td
          triGridCell
          [rowIndex]="-1"
          [isNew]="true"
          [column]="column"
          [dataItem]="newDataItem"
          [ngClass]="column.cssClass"
          [ngStyle]="column.style"
          [attr.colspan]="column.colspan"
          *ngFor="let column of columns; let columnIndex = index">
          <ng-template
            tri-template-context
            [templateContext]="{
                        templateRef: column.templateRef,
                        dataItem: newDataItem,
                        column: column,
                        columnIndex: columnIndex,
                        rowIndex: -1,
                        isNew: true,
                        $implicit: newDataItem
                        }">
          </ng-template>
          <ng-template [ngIf]="isBoundColumn(column)">{{newDataItem | valueOf: column.field: column.format}}
          </ng-template>

        </td>
      </tr>
    </ng-template>
    <tr *ngIf="data?.length === 0 || data == null" class="ant-grid-norecords">
      <td [attr.colspan]="colSpan">
        <ng-template
          [ngIf]="noRecordsTemplate?.templateRef"
          tri-template-context
          [templateContext]="{
                    templateRef: noRecordsTemplate?.templateRef
                 }">
        </ng-template>
        <ng-container *ngIf="!noRecordsTemplate?.templateRef">
          {{noRecordsText}}
        </ng-container>
      </td>
    </tr>
    <ng-template ngFor
                 [ngForOf]="data"
                 [ngForTrackBy]="trackByFn()"
                 let-item>
      <tr *ngIf="isGroup(item) && isParentGroupExpanded(item)"
          triGridGroupHeader
          [columns]="columns"
          [groups]="groups"
          [item]="item"
          [hasDetails]="detailTemplate?.templateRef"
          [skipGroupDecoration]="skipGroupDecoration">
      </tr>
      <tr
        *ngIf="isDataItem(item) && isInExpandedGroup(item)"
        [ngClass]="rowClass({ dataItem: item.data, index: item.index })"
        [class.ant-alt]="isOdd(item)"
        [class.ant-master-row]="detailTemplate?.templateRef"
        [class.ant-grid-edit-row]="editService.isEdited(item.index)"
        [triGridSelectable]="isSelectable()"
        [index]="item.index">
        <ng-template [ngIf]="!skipGroupDecoration">
          <td [class.ant-group-cell]="true" *ngFor="let g of groups"></td>
        </ng-template>
        <td [class.ant-hierarchy-cell]="true"
            *ngIf="detailTemplate?.templateRef">
          <a class="ant-icon"
             *ngIf="detailTemplate.showIf(item.data, item.index)"
             [ngClass]="detailButtonStyles(item.index)"
             href="#" tabindex="-1" (click)="toggleRow(item.index, item.data)"></a>
        </td>
        <td
          triGridCell
          [rowIndex]="item.index"
          [column]="column"
          [dataItem]="item.data"
          [ngClass]="column.cssClass"
          [ngStyle]="column.style"
          [attr.colspan]="column.colspan"
          *ngFor="let column of columns; let columnIndex = index">
          <ng-template
            tri-template-context
            [templateContext]="{
                        templateRef: column.templateRef,
                        dataItem: item.data,
                        column: column,
                        columnIndex: lockedColumnsCount + columnIndex,
                        rowIndex: item.index,
                        $implicit: item.data
                        }">
          </ng-template>
          <ng-template [ngIf]="isSpanColumn(column)">
            <ng-template ngFor let-childColumn [ngForOf]="childColumns(column)">
              {{item.data | valueOf: childColumn.field: childColumn.format}}
            </ng-template>
          </ng-template>
          <ng-template [ngIf]="isBoundColumn(column)">{{item.data | valueOf: column.field: column.format}}
          </ng-template>
          <ng-template [ngIf]="isCheckboxColumn(column)">
            <tri-checkbox [triGridSelectionCheckbox]="item.index"></tri-checkbox>
          </ng-template>
        </td>
      </tr>
      <tr *ngIf="isDataItem(item) && 
                 isInExpandedGroup(item) && 
                 detailTemplate?.templateRef &&
                 detailTemplate.showIf(item.data, item.index) && 
                 isExpanded(item.index)"
          [class.ant-detail-row]="true"
          [class.ant-alt]="isOdd(item)">
        <td [class.ant-group-cell]="true" *ngFor="let g of groups"></td>
        <td [class.ant-hierarchy-cell]="true"></td>
        <td [class.ant-detail-cell]="true"
            [attr.colspan]="columnsSpan">
          <ng-template
            tri-template-context
            [templateContext]="{
                        templateRef: detailTemplate?.templateRef,
                        dataItem: item.data,
                        rowIndex: item.index,
                        $implicit: item.data
                        }">
          </ng-template>
        </td>
      </tr>
      <tr
        *ngIf="isFooter(item) && (isInExpandedGroup(item) || (showGroupFooters && isParentGroupExpanded(item)))"
        [class.ant-group-footer]="true">
        <ng-template [ngIf]="!skipGroupDecoration">
          <td [class.ant-group-cell]="true" *ngFor="let g of groups"></td>
        </ng-template>
        <td [class.ant-hierarchy-cell]="true"
            *ngIf="detailTemplate?.templateRef">
        </td>
        <td
          *ngFor="let column of footerColumns;">
          <ng-template
            tri-template-context
            [templateContext]="{
                        templateRef: column.groupFooterTemplateRef,
                        group: item.data,
                        field: column.field,
                        column: column,
                        $implicit: item.data?.aggregates
                        }">
          </ng-template>
        </td>
      </tr>
    </ng-template>
  `
})
export class TableBodyComponent implements OnChanges {
  detailsService: DetailsService;
  groupsService: GroupsService;
  private changeNotification;
  editService: EditService;
  @Input() columns: ColumnBase[];
  @Input() groups: GroupDescriptor[];
  @Input() detailTemplate: DetailTemplateDirective;
  @Input() noRecordsTemplate: NoRecordsTemplateDirective;
  @Input() data: Array<GroupItem | Item | GroupFooterItem>;
  @Input() skip: number;
  @Input() selectable: boolean | SelectableSettings;
  @Input() noRecordsText: string;
  @Input() skipGroupDecoration: boolean;
  @Input() showGroupFooters: boolean;
  @Input() lockedColumnsCount: number;
  @Input() rowClass: RowClassFn;

  constructor(detailsService: DetailsService,
              groupsService: GroupsService,
              changeNotification: ChangeNotificationService,
              editService: EditService) {
    this.detailsService = detailsService;
    this.groupsService = groupsService;
    this.changeNotification = changeNotification;
    this.editService = editService;
    this.columns = [];
    this.groups = [];
    this.skip = 0;
    this.noRecordsText = '没有记录';
    this.skipGroupDecoration = false;
    this.showGroupFooters = false;
    this.lockedColumnsCount = 0;
    this.rowClass = () => null;
  }

  get newDataItem(): any {
    return this.editService.newDataItem;
  }

  toggleRow(index, dataItem): boolean {
    this.detailsService.toggleRow(index, dataItem);
    return false;
  }

  trackByFn(): Function {
    return (_, item) => item.data ? item.data : item;
  }

  isExpanded(index): boolean {
    return this.detailsService.isExpanded(index);
  }

  detailButtonStyles(index) {
    const expanded = this.isExpanded(index);
    return {'ant-minus': expanded, 'ant-plus': !expanded};
  }

  isGroup(item) {
    return item.type === 'group';
  }

  isDataItem(item) {
    return !this.isGroup(item) && !this.isFooter(item);
  }

  isFooter(item) {
    return item.type === 'footer';
  }

  isInExpandedGroup(item) {
    return this.groupsService.isInExpandedGroup(item.groupIndex, false);
  }

  isParentGroupExpanded(item) {
    return this.groupsService.isInExpandedGroup(item.index || item.groupIndex);
  }

  isOdd(item) {
    return item.index % 2 === 0;
  }

  ngOnChanges(changes) {
    if (isChanged('columns', changes, false)) {
      this.changeNotification.notify();
    }
  }

  get columnsSpan() {
    return columnsSpan(this.columns);
  }

  get colSpan() {
    return this.columnsSpan + this.groups.length + (isPresent(this.detailTemplate) ? 1 : 0);
  }

  get footerColumns() {
    return columnsToRender(this.columns);
  }

  isSpanColumn(column) {
    return isSpanColumn(column) && !column.templateRef;
  }

  childColumns(column) {
    return columnsToRender([column]);
  }

  isBoundColumn(column) {
    return column.field && !column.templateRef;
  }

  isCheckboxColumn(column) {
    return isCheckboxColumn(column) && !column.templateRef;
  }

  isSelectable(): boolean {
    return this.selectable && (this.selectable as SelectableSettings).enabled !== false;
  }

  isSelectableSingle(): boolean {
    return this.isSelectable() && (this.selectable as SelectableSettings).mode === 'single';
  }

  isSelectableMultiple(): boolean {
    return this.isSelectable() && (this.selectable as SelectableSettings).mode === 'multiple';
  }
}
