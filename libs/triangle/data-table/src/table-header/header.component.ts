import { CompositeFilterDescriptor, GroupDescriptor, SortDescriptor } from '@gradii/triangle/data-query';
import { isNullOrEmptyString, isPresent, isTruthy } from '@gradii/triangle/util';
import { Component, EventEmitter, HostBinding, Input, OnDestroy, Output, QueryList, ViewChildren } from '@angular/core';
import { ColumnBase, isCheckboxColumn } from '../columns/column-base';
import { isColumnGroupComponent } from '../columns/column-group.component';
import { ColumnComponent } from '../columns/column.component';
import { GroupDragService } from '../grouping/group-connection.service';
import { columnsToRender } from '../helper/column-common';
import { normalize, SortSettings } from '../helper/sort-settings';
import { DetailTemplateDirective } from '../table-shared/detail-template.directive';
import { DraggableDirective } from '../table-shared/draggable.directive';
import { observe } from '../utils';

@Component({
  selector           : 'tri-grid-header, [triGridHeader]',
  providers          : [GroupDragService],
  preserveWhitespaces: false,
  template           : `
    <ng-template [ngIf]="true">
      <tr *ngFor="let i of columnLevels; let levelIndex = index">
        <th
          [class.tri-group-cell]="true"
          [class.tri-header]="true"
          *ngFor="let g of groups">
        </th>
        <th
          [class.tri-hierarchy-cell]="true"
          [class.tri-header]="true"
          *ngIf="detailTemplate?.templateRef">
        </th>
        <ng-template ngFor let-column [ngForOf]="columnsForLevel(levelIndex)" let-columnIndex="index">
          <th cdkOverlayOrigin
              #columnAnchor="cdkOverlayOrigin"
              tri-grid-draggable
              [gridDraggable]="column"
              [class.tri-header]="true"
              [class.tri-first]="isFirstOnRow(column, columnIndex)"
              *ngIf="!isColumnGroupComponent(column)"
              [ngClass]="column.headerClass"
              [ngStyle]="column.headerStyle"
              [attr.rowspan]="column.rowspan(totalColumnLevels)"
              [attr.colspan]="column.colspan">
            <tri-data-table-filter-menu
              *ngIf="showFilterMenu && isFilterable(column)"
              [column]="column"
              [filter]="filter"
              [columnOverlayOrigin]="columnAnchor">
            </tri-data-table-filter-menu>
            <tri-data-table-filter-simple
              *ngIf="showFilterSimple && isFilterable(column)"
              [column]="column"
              [filter]="filter">
            </tri-data-table-filter-simple>
            <ng-template [ngIf]="!isSortable(column)">
              <ng-template
                tri-template-context
                [templateContext]="{
                                        templateRef: column.headerTemplateRef,
                                        columnIndex: lockedColumnsCount + columnIndex,
                                        column: column,
                                        $implicit: column}">
              </ng-template>
              <ng-template [ngIf]="!column.headerTemplateRef">{{column.displayTitle}}</ng-template>
            </ng-template>
            <ng-template [ngIf]="isSortable(column)">
              <a href="#" #link class="ant-link" (click)="sortColumn(column, $event, link, sortSpan)">
                <ng-template
                  tri-template-context
                  [templateContext]="{
                                          templateRef: column.headerTemplateRef,
                                          columnIndex: columnIndex,
                                          column: column,
                                          $implicit: column}">
                </ng-template>
                <ng-template [ngIf]="!column.headerTemplateRef">{{column.displayTitle}}</ng-template>
                <span #sortSpan [ngClass]="sortIcon(column.field)"></span>
              </a>
            </ng-template>
            <ng-template [ngIf]="isCheckboxColumn(column) && !column.headerTemplateRef && column.showSelectAll">
              <tri-checkbox triGridSelectAllCheckbox></tri-checkbox>
            </ng-template>
            <!-- <span triGridColumnHandle
                   triGridDraggable
                   class="ant-column-resizer"
                   *ngIf="resizable"
                   [column]="column"
                   [columns]="columns">
             </span>-->
          </th>
          <th *ngIf="isColumnGroupComponent(column)"
              [class.tri-header]="true"
              [class.tri-first]="isFirstOnRow(column, columnIndex)"
              [ngClass]="column.headerClass"
              [ngStyle]="column.headerStyle"
              [attr.rowspan]="column.rowspan(totalColumnLevels)"
              [attr.colspan]="column.colspan">
            <ng-template
              tri-template-context
              [templateContext]="{
                                      templateRef: column.headerTemplateRef,
                                      columnIndex: lockedColumnsCount + columnIndex,
                                      column: column,
                                      $implicit: column}">
            </ng-template>
            <ng-template [ngIf]="!column.headerTemplateRef">{{column.displayTitle}}</ng-template>
          </th>
        </ng-template>
      </tr>
      <tr triGridFilterRow
          *ngIf="showFilterRow"
          [columns]="leafColumns"
          [filter]="filter"
          [groups]="groups"
          [detailTemplate]="detailTemplate"
      ></tr>
    </ng-template>
  `
})
export class HeaderComponent implements OnDestroy {
  private groupDragService;
  @Input() totalColumnLevels: number;
  @Input() columns: ColumnBase[];
  @Input() groups: GroupDescriptor[];
  @Input() detailTemplate: DetailTemplateDirective;
  @Input() scrollable: boolean;
  @Input() filterable: boolean | 'menu' | 'simple';
  @Input() sort: SortDescriptor[];
  @Input() filter: CompositeFilterDescriptor;
  @Input() sortable: SortSettings;
  @Input() groupable: boolean;
  @Input() lockedColumnsCount: number;
  @Output() sortChange: EventEmitter<SortDescriptor[]>;
  // readonly headerClass: boolean;
  @ViewChildren(DraggableDirective) draggables: QueryList<DraggableDirective>;
  private draggablesSubscription;

  constructor(groupDragService: GroupDragService) {
    this.groupDragService = groupDragService;
    this.columns = [];
    this.groups = [];
    this.sort = [];
    this.sortable = false;
    this.groupable = false;
    this.lockedColumnsCount = 0;
    this.sortChange = new EventEmitter();
  }

  @HostBinding('class.tri-grid-header')
  get headerClass() {
    return !this.scrollable;
  }

  get leafColumns(): ColumnBase[] {
    return columnsToRender(this.columns || []).filter(x => !isColumnGroupComponent(x));
  }

  get showFilterRow() {
    return this.filterable === true;
  }

  get showFilterMenu() {
    return this.filterable === 'menu';
  }

  get showFilterSimple() {
    return this.filterable === 'simple';
  }

  isFilterable(column) {
    return !!column.filterable;
  }

  sortColumn(column: ColumnComponent, event: any, link: any, icon: any) {
    const target = event ? event.target : null;
    if (column.headerTemplateRef && target !== link && target !== icon) {
      return false;
    }
    this.sortChange.emit(this.toggleSort(column));
    // prevent default
    return false;
  }

  sortIcon(field: string): any {
    const state = this.sortDescriptor(field);
    return {
      'ant-icon'          : isPresent(state.dir),
      'ant-i-sort-desc-sm': state.dir === 'desc',
      'ant-i-sort-asc-sm' : state.dir === 'asc'
    };
  }

  toggleSort(column: ColumnComponent): SortDescriptor[] {
    const _a = normalize(this.sortable, column.sortable);
    const allowUnsort = _a.allowUnsort;
    const mode = _a.mode;
    const descriptor = this.toggleDirection(column.field, allowUnsort);
    if (mode === 'single') {
      return [descriptor];
    }
    return this.sort.filter(desc => desc.field !== column.field).concat([descriptor]);
  }

  ngAfterViewInit() {
    const _this = this;
    const isNotGrouped = _a => {
      const column = _a.column;
      return _this.groupable && !_this.groups.some(group => group.field === column.field);
    };
    this.draggablesSubscription = observe(this.draggables).subscribe(items =>
      _this.groupDragService.connect(items.filter(x => isPresent(x.column.field)), isNotGrouped)
    );
  }

  ngOnDestroy() {
    this.groupDragService.unsubscribe();
    if (this.draggablesSubscription) {
      this.draggablesSubscription.unsubscribe();
    }
  }

  isFirstOnRow(column: ColumnComponent, index: number): boolean {
    const _this = this;
    const isTailing = c => c && (_this.columnsForLevel(c.level).indexOf(c) > 0 || isTailing(c.parent));
    return index === 0 && !this.groups.length && !this.detailTemplate && isTailing(column.parent);
  }

  protected isSortable(column: ColumnComponent): boolean {
    return !isNullOrEmptyString(column.field) && isTruthy(this.sortable) && isTruthy(column.sortable);
  }

  protected toggleDirection(field: string, allowUnsort: boolean): SortDescriptor {
    const descriptor = this.sortDescriptor(field);
    let dir = 'asc';
    if (descriptor.dir === 'asc') {
      dir = 'desc';
    } else if (descriptor.dir === 'desc' && allowUnsort) {
      dir = undefined;
    }
    return <SortDescriptor>{dir, field};
  }

  protected columnsForLevel(level: number): ColumnBase[] {
    return columnsToRender(this.columns ? this.columns.filter(column => column.level === level) : []);
  }

  protected isCheckboxColumn(column) {
    return isCheckboxColumn(column) && !column.templateRef;
  }

  protected isColumnGroupComponent(column: ColumnBase): boolean {
    return isColumnGroupComponent(column);
  }

  private sortDescriptor(field): any {
    return this.sort.find(item => item.field === field) || {field};
  }

  private get columnLevels() {
    return new Array((this.totalColumnLevels || 0) + 1);
  }
}
