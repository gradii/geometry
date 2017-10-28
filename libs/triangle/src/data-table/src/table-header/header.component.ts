import { Component, Input, Output, HostBinding, EventEmitter, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { isColumnGroupComponent } from '../columns/column-group.component';
import { normalize, SortSettings } from '../helper/sort-settings';
import { isPresent, isTruthy, isNullOrEmptyString, observe } from '../utils';
import { DraggableDirective } from '../table-shared/draggable.directive';
import { GroupDragService } from '../grouping/group-connection.service';
import { columnsToRender } from '../helper/column-common';
import { CompositeFilterDescriptor, GroupDescriptor, SortDescriptor } from '@gradii/triangle/data-query';
import { DetailTemplateDirective } from '../table-shared/detail-template.directive';
import { ColumnBase, isCheckboxColumn } from '../columns/column-base';
import { ColumnComponent } from '../columns/column.component';
@Component({
  providers: [GroupDragService],
  selector: 'tri-grid-header, [triGridHeader]',
  template: `
               <ng-template [ngIf]="true">
                 <tr *ngFor="let i of columnLevels; let levelIndex = index">
                   <th
                     [class.ant-group-cell]="true"
                     [class.ant-header]="true"
                     *ngFor="let g of groups">
                   </th>
                   <th
                     [class.ant-hierarchy-cell]="true"
                     [class.ant-header]="true"
                     *ngIf="detailTemplate?.templateRef">
                   </th>
                   <ng-template ngFor let-column [ngForOf]="columnsForLevel(levelIndex)" let-columnIndex="index">
                     <th tri-grid-draggable
                         [gridDraggable]="column"
                         [class.ant-header]="true"
                         [class.ant-first]="isFirstOnRow(column, columnIndex)"
                         *ngIf="!isColumnGroupComponent(column)"
                         [ngClass]="column.headerClass"
                         [ngStyle]="column.headerStyle"
                         [attr.rowspan]="column.rowspan(totalColumnLevels)"
                         [attr.colspan]="column.colspan">
                       <ng-template [ngIf]="!isSortable(column)">
                         <ng-template
                           tri-template-context
                           [templateContext]="{
                                templateRef: column.headerTemplateRef,
                                columnIndex: lockedColumnsCount + columnIndex,
                                column: column,
                                $implicit: column
                            }">
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
                                    $implicit: column
                                }">
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
                         [class.ant-header]="true"
                         [class.ant-first]="isFirstOnRow(column, columnIndex)"
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
                                $implicit: column
                            }">
                       </ng-template>
                       <ng-template [ngIf]="!column.headerTemplateRef">{{column.displayTitle}}</ng-template>
                     </th>
                   </ng-template>
                 </tr>
                 <tr triGridFilterRow
                     *ngIf="filterable"
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
  @Input() filterable: boolean;
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
    this.sort = new Array();
    this.sortable = false;
    this.groupable = false;
    this.lockedColumnsCount = 0;
    this.sortChange = new EventEmitter();
  }
  @HostBinding('class.ant-grid-header')
  get headerClass() {
    return !this.scrollable;
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
      'ant-icon': isPresent(state.dir),
      'ant-i-sort-desc-sm': state.dir === 'desc',
      'ant-i-sort-asc-sm': state.dir === 'asc'
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
    return <SortDescriptor>{ dir, field };
  }
  protected columnsForLevel(level: number): ColumnBase[] {
    return columnsToRender(this.columns ? this.columns.filter(column => column.level === level) : []);
  }
  protected  isCheckboxColumn (column) {
    return isCheckboxColumn(column) && !column.templateRef;
  };
  protected isColumnGroupComponent(column: ColumnBase): boolean {
    return isColumnGroupComponent(column);
  }
  private sortDescriptor(field): any {
    return this.sort.find(item => item.field === field) || { field };
  }
  private get columnLevels() {
    return new Array((this.totalColumnLevels || 0) + 1);
  }
  get leafColumns(): ColumnBase[] {
    return columnsToRender(this.columns || []).filter(x => !isColumnGroupComponent(x));
  }
}
