import { CompositeFilterDescriptor, GroupDescriptor, GroupResult, SortDescriptor } from '@gradii/triangle/data-query';
import { SelectableSettings } from '@gradii/triangle/data-table';
import { isArray, isFunction, isObject, isPresent } from '@gradii/triangle/util';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  isDevMode,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { merge } from 'rxjs/operators/merge';
import { CELL_CONTEXT, EMPTY_CELL_CONTEXT } from './cell-context';
import { ColumnBase } from './columns/column-base';
import { isColumnGroupComponent } from './columns/column-group.component';
import { ColumnList } from './columns/column-list';
import { ColumnComponent } from './columns/column.component';
import { ColumnsContainer } from './columns/columns-container';
import { DataResultIterator, GridDataResult } from './data-collection/data-result-iterator';
import { DataCollection } from './data-collection/data.collection';
import { NoRecordsTemplateDirective } from './directive/no-records-template.directive';
import { AddEvent } from './event/add-event-args.interface';
import { CancelEvent } from './event/cancel-event-args.interface';
import { DataStateChangeEvent, PageChangeEvent } from './event/change-event-args.interface';
import { EditEvent } from './event/edit-event-args.interface';
import { RemoveEvent } from './event/remove-event-args.interface';
import { SaveEvent } from './event/save-event-args.interface';
import { FilterService } from './filtering/filter.service';
import { GroupConnectionService } from './grouping/group-connection.service';
import { GroupInfoService } from './grouping/group-info.service';
import { GroupableSettings } from './grouping/group-settings';
import { GroupsService } from './grouping/groups.service';
import { columnsToRender, expandColumns } from './helper/column-common';
import { ScrollMode } from './helper/scrollmode';
import { SortSettings } from './helper/sort-settings';
import { ListComponent } from './list.component';
import { RowClassFn, RowSelectedFn } from './row-class';
import { syncRowsHeight } from './row-sync';
import { Selection } from './selection/selection-default';
import { SelectionEvent, SelectionService } from './selection/selection.service';
import { BrowserSupportService } from './service/browser-support.service';
import { ChangeNotificationService } from './service/change-notification.service';
import { DetailsService } from './service/details.service';
import { DomEventsService } from './service/dom-events.service';
import { EditService } from './service/edit.service';
import { ResponsiveService } from './service/responsive.service';
import { ScrollSyncService } from './service/scroll-sync.service';
import { SuspendService } from './service/suspend.service';

import { DetailTemplateDirective } from './table-shared/detail-template.directive';
import { ToolbarTemplateDirective } from './table-shared/toolbar-template.directive';
import { anyChanged, isChanged, isUniversal } from './utils';

const createControl = source => (acc, key) => {
  acc[key] = new FormControl(source[key]);
  return acc;
};

const fieldMapFnObjectFactory = obj => {
  return function (field): string {
    for (let [key, val] of Object.entries(obj)) {
      if (field === key) {
        return val as string;
      }
    }
  };
};
export type fieldMapFn = (fieldKey: string) => string;

/**
 *
 <ng-container triGridLocalizedMessages
 i18n-groupPanelEmpty="nz.grid.groupPanelEmpty|The label visible in the Grid group panel when it is empty"
 groupPanelEmpty="Drag a column header and drop it here to group by that column"
 i18n-noRecords="nz.grid.noRecords|The label visible in the Grid when there are no records"
 noRecords="No records available."
 i18n-pagerFirstPage="nz.grid.pagerFirstPage|The label for the first page button in Grid pager"
 pagerFirstPage="Go to the first page"
 i18n-pagerPreviousPage="nz.grid.pagerPreviousPage|The label for the previous page button in Grid pager"
 pagerPreviousPage="Go to the previous page"
 i18n-pagerNextPage="nz.grid.pagerNextPage|The label for the next page button in Grid pager"
 pagerNextPage="Go to the next page"
 i18n-pagerLastPage="nz.grid.pagerLastPage|The label for the last page button in Grid pager"
 pagerLastPage="Go to the last page"
 i18n-pagerPage="nz.grid.pagerPage|The label before the current page number in the Grid pager"
 pagerPage="Page"
 i18n-pagerOf="nz.grid.pagerOf|The label before the total pages number in the Grid pager"
 pagerOf="of"
 i18n-pagerItems="nz.grid.pagerItems|The label after the total pages number in the Grid pager"
 pagerItems="items"
 i18n-pagerItemsPerPage="nz.grid.pagerItemsPerPage|The label for the page size chooser in the Grid pager"
 pagerItemsPerPage="items per page"
 i18n-filterEqOperator="nz.grid.filterEqOperator|The text of the equal filter operator"
 filterEqOperator="Is equal to"
 i18n-filterNotEqOperator="nz.grid.filterNotEqOperator|The text of the not equal filter operator"
 filterNotEqOperator="Is not equal to"
 i18n-filterIsNullOperator="nz.grid.filterIsNullOperator|The text of the is null filter operator"
 filterIsNullOperator="Is null"
 i18n-filterIsNotNullOperator="nz.grid.filterIsNotNullOperator|The text of the is not null filter operator"
 filterIsNotNullOperator="Is not null"
 i18n-filterIsEmptyOperator="nz.grid.filterIsEmptyOperator|The text of the is empty filter operator"
 filterIsEmptyOperator="Is empty"
 i18n-filterIsNotEmptyOperator="nz.grid.filterIsNotEmptyOperator|The text of the is not empty filter operator"
 filterIsNotEmptyOperator="Is not empty"
 i18n-filterStartsWithOperator="nz.grid.filterStartsWithOperator|The text of the starts with filter operator"
 filterStartsWithOperator="Starts with"
 i18n-filterContainsOperator="nz.grid.filterContainsOperator|The text of the contains filter operator"
 filterContainsOperator="Contains"
 i18n-filterNotContainsOperator="nz.grid.filterNotContainsOperator|The text of the does not contain filter operator"
 filterNotContainsOperator="Does not contain"
 i18n-filterEndsWithOperator="nz.grid.filterEndsWithOperator|The text of the ends with filter operator"
 filterEndsWithOperator="Ends with"
 i18n-filterGteOperator="nz.grid.filterGteOperator|The text of the greater than or equal filter operator"
 filterGteOperator="Is greater than or equal to"
 i18n-filterGtOperator="nz.grid.filterGtOperator|The text of the greater than filter operator"
 filterGtOperator="Is greater than"
 i18n-filterLteOperator="nz.grid.filterLteOperator|The text of the less than or equal filter operator"
 filterLteOperator="Is less than or equal to"
 i18n-filterLtOperator="nz.grid.filterLtOperator|The text of the less than filter operator"
 filterLtOperator="Is less than"
 i18n-filterIsTrue="nz.grid.filterIsTrue|The text of the IsTrue boolean filter option"
 filterIsTrue="Is True"
 i18n-filterIsFalse="nz.grid.filterIsFalse|The text of the IsFalse boolean filter option"
 filterIsFalse="Is False"
 i18n-filterBooleanAll="nz.grid.filterBooleanAll|The text of the (All) boolean filter option"
 filterBooleanAll="(All)"
 i18n-filterAfterOrEqualOperator="nz.grid.filterAfterOrEqualOperator|The text of the after or equal date filter operator"
 filterAfterOrEqualOperator="Is after or equal to"
 i18n-filterAfterOperator="nz.grid.filterAfterOperator|The text of the after date filter operator"
 filterAfterOperator="Is after"
 i18n-filterBeforeOperator="nz.grid.filterBeforeOperator|The text of the before date filter operator"
 filterBeforeOperator="Is before"
 i18n-filterBeforeOrEqualOperator="nz.grid.filterBeforeOrEqualOperator|The text of the before or equal date filter operator"
 filterBeforeOrEqualOperator="Is before or equal to"
 >
 </ng-container>
 */
@Component({
  selector           : 'tri-data-table',
  exportAs           : 'triDataTable',
  preserveWhitespaces: false,
  providers          : [
    BrowserSupportService,
    SelectionService,
    DetailsService,
    GroupsService,
    GroupInfoService,
    GroupConnectionService,
    ChangeNotificationService,
    EditService,
    SuspendService,
    FilterService,
    ResponsiveService,
    ScrollSyncService,
    DomEventsService,
    {
      provide : CELL_CONTEXT,
      useValue: EMPTY_CELL_CONTEXT
    }
  ],
  host               : {
    '[attr.dir]'       : 'direction',
    '[style.height.px]': 'height'
  },
  template           : `
    <tri-data-table-toolbar *ngIf="showTopToolbar"></tri-data-table-toolbar>
    <!--<tri-spin >-->
    <div class="ant-grid ant-widget ant-data-table ant-table-large"
         [class.ant-grid-lockedcolumns]="lockedLeafColumns.length > 0"
         [class.ant-grid-virtual]="isVirtual"
    >
      <tri-data-table-group-panel
        class="ant-table-title"
        *ngIf="showGroupPanel"
        [text]="groupable.emptyText"
        [groups]="group"
        (change)="groupChange.emit($event)">
      </tri-data-table-group-panel>
      <ng-template [ngIf]="isScrollable">
        <div
          class="ant-grid-header ant-data-table-header ant-data-table-thead"
          [style.padding]="headerPadding">
          <div class="ant-grid-header ant-data-table-header-locked" #lockedHeader
               *ngIf="isLocked"
               [style.width.px]="lockedWidth">
            <table>
              <colgroup triGridColGroup
                        [columns]="lockedLeafColumns"
                        [groups]="group"
                        [detailTemplate]="detailTemplate">
              </colgroup>
              <thead triGridHeader
                     [scrollable]="true"
                     [columns]="lockedColumns"
                     [totalColumnLevels]="totalColumnLevels"
                     [sort]="sort"
                     [groups]="group"
                     [filter]="filter"
                     [filterable]="filterable"
                     [groupable]="showGroupPanel"
                     [sortable]="sortable"
                     (sortChange)="sortChange.emit($event)"
                     [detailTemplate]="detailTemplate">
              </thead>
            </table>
          </div>
          <div class="ant-grid-header-wrap ant-data-table-header-wrap" #header
               [triGridResizableContainer]="lockedLeafColumns.length"
               [lockedWidth]="lockedWidth + scrollbarWidth + 3">
            <table [style.width.px]="nonLockedWidth">
              <colgroup triGridColGroup
                        [columns]="nonLockedLeafColumns"
                        [groups]="isLocked ? [] : group"
                        [detailTemplate]="detailTemplate">
              </colgroup>
              <thead triGridHeader
                     [scrollable]="true"
                     [columns]="nonLockedColumns"
                     [totalColumnLevels]="totalColumnLevels"
                     [sort]="sort"
                     [filter]="filter"
                     [filterable]="filterable"
                     [groupable]="showGroupPanel"
                     [groups]="isLocked ? [] : group"
                     [sortable]="sortable"
                     [lockedColumnsCount]="lockedLeafColumns.length"
                     (sortChange)="sortChange.emit($event)"
                     [detailTemplate]="detailTemplate">
              </thead>
            </table>
          </div>
        </div>
        <tri-grid-list
          tri-grid-selectable
          [data]="view"
          [rowHeight]="rowHeight"
          [detailRowHeight]="detailRowHeight"
          [total]="isVirtual ? view.total : pageSize"
          [take]="pageSize"
          [groups]="group"
          [groupable]="groupable"
          [skip]="skip"
          [columns]="columnsContainer"
          [selectable]="selectable"
          [detailTemplate]="detailTemplate"
          [noRecordsTemplate]="noRecordsTemplate"
          (pageChange)="notifyPageChange('list', $event)"
          [rowClass]="rowClass">
        </tri-grid-list>
        <div
          *ngIf="showFooter"
          class="ant-table-footer"
          [style.paddingRight.px]="scrollbarWidth">
          <div
            *ngIf="lockedLeafColumns.length"
            class="ant-table-footer-locked"
            [style.width.px]="lockedWidth">
            <table>
              <colgroup triGridColGroup
                        [columns]="lockedLeafColumns"
                        [groups]="group"
                        [detailTemplate]="detailTemplate">
              </colgroup>
              <tfoot triGridFooter
                     [scrollable]="true"
                     [groups]="group"
                     [columns]="lockedLeafColumns"
                     [detailTemplate]="detailTemplate">
              </tfoot>
            </table>
          </div>
          <div #footer
               class="ant-table-footer-wrap"
               [triGridResizableContainer]="lockedLeafColumns.length"
               [lockedWidth]="lockedWidth + scrollbarWidth + 3">
            <table [style.width.px]="nonLockedWidth">
              <colgroup triGridColGroup
                        [columns]="nonLockedLeafColumns"
                        [groups]="isLocked ? [] : group"
                        [detailTemplate]="detailTemplate">
              </colgroup>
              <tfoot triGridFooter
                     [scrollable]="true"
                     [groups]="isLocked ? [] : group"
                     [columns]="nonLockedLeafColumns"
                     [lockedColumnsCount]="lockedLeafColumns.length"
                     [detailTemplate]="detailTemplate">
              </tfoot>
            </table>
          </div>
        </div>
      </ng-template>
      <ng-template [ngIf]="!isScrollable">
        <table>
          <colgroup triGridColGroup
                    [columns]="leafColumns"
                    [groups]="group"
                    [detailTemplate]="detailTemplate">
          </colgroup>
          <thead triGridHeader
                 [scrollable]="false"
                 [columns]="visibleColumns"
                 [totalColumnLevels]="totalColumnLevels"
                 [groups]="group"
                 [groupable]="showGroupPanel"
                 [sort]="sort"
                 [sortable]="sortable"
                 [filter]="filter"
                 [filterable]="filterable"
                 (sortChange)="sortChange.emit($event)"
                 [detailTemplate]="detailTemplate">
          </thead>
          <tbody triGridTableBody
                 [groups]="group"
                 [data]="view"
                 [skip]="skip"
                 [columns]="leafColumns"
                 [selectable]="selectable"
                 [noRecordsTemplate]="noRecordsTemplate"
                 [detailTemplate]="detailTemplate"
                 [rowClass]="rowClass">
          </tbody>
          <tfoot triGridFooter
                 *ngIf="showFooter"
                 [scrollable]="false"
                 [groups]="group"
                 [columns]="leafColumns"
                 [detailTemplate]="detailTemplate">
          </tfoot>
        </table>
      </ng-template>
    </div>
    <!--</tri-spin>-->
    <tri-pagination
      class="ant-data-table-pagination"
      *ngIf="showPager"
      [offset]="skip"
      [limit]="pageSize"
      [total]="view.total"
      [showTotal]="true"
      [showSizeChanger]="true"
      [showQuickJumper]="true"
      [showDetail]="true"
      (pageChange)="notifyPageChange('pager', $event)">
      >
    </tri-pagination>
    <tri-data-table-toolbar *ngIf="showBottomToolbar"></tri-data-table-toolbar>
  `
})
export class DataTableComponent implements OnChanges, AfterViewInit, AfterContentChecked, AfterContentInit, OnDestroy {
  private _rowClass;
  private _RowSelected;
  private _hasGeneratedColumn: boolean;

  @Input() data: any[] | GridDataResult;
  @Input() pageSize: number;
  @Input() height: number;
  @Input() rowHeight: number;
  @Input() detailRowHeight: number;
  @Input() skip = 0;
  @Input() scrollable: ScrollMode = 'scrollable';
  @Input() selectable: boolean | SelectableSettings = false;
  @Input() filter: CompositeFilterDescriptor;
  @Input() filterable: boolean | 'menu' | 'simple' = false;
  @Input() sortable: SortSettings = false;
  @Input() pageable: boolean = false;
  @Input() groupable: GroupableSettings | boolean = false;
  @Input() autoGenerateColumns: boolean;
  @Input() fieldMap: fieldMapFn | object;

  @Output() filterChange: EventEmitter<CompositeFilterDescriptor> = new EventEmitter();
  @Output() pageChange: EventEmitter<PageChangeEvent> = new EventEmitter();
  @Output() groupChange: EventEmitter<GroupDescriptor[]> = new EventEmitter();
  @Output() sortChange: EventEmitter<SortDescriptor[]> = new EventEmitter();
  @Output() selectionChange: EventEmitter<SelectionEvent> = new EventEmitter();
  @Output() dataStateChange: EventEmitter<DataStateChangeEvent> = new EventEmitter();
  @Output() groupExpand: EventEmitter<{ group: GroupResult }> = new EventEmitter();
  @Output() groupCollapse: EventEmitter<{ group: GroupResult }> = new EventEmitter();
  @Output() detailExpand: EventEmitter<{ index: number; dataItem: any }> = new EventEmitter();
  @Output() detailCollapse: EventEmitter<{ index: number; dataItem: any }> = new EventEmitter();
  @Output() edit: EventEmitter<EditEvent> = new EventEmitter();
  @Output() cancel: EventEmitter<CancelEvent> = new EventEmitter();
  @Output() save: EventEmitter<SaveEvent> = new EventEmitter();
  @Output() remove: EventEmitter<RemoveEvent> = new EventEmitter();
  @Output() add: EventEmitter<AddEvent> = new EventEmitter();

  @ContentChildren(ColumnBase) columns: QueryList<ColumnBase>;
  @ContentChild(DetailTemplateDirective) detailTemplate: DetailTemplateDirective;
  @ContentChildren(NoRecordsTemplateDirective) noRecordsTemplate: NoRecordsTemplateDirective;
  // todo
  // @ContentChild(PagerTemplateDirective)
  // pagerTemplate: PagerTemplateDirective;
  @ContentChild(ToolbarTemplateDirective) toolbarTemplate: ToolbarTemplateDirective;
  @ViewChild('lockedHeader') lockedHeader: any;
  @ViewChild('header') header: any;
  @ViewChild('footer') footer: any;
  @ViewChild(ListComponent) list: ListComponent;
  scrollbarWidth: number;
  columnList: ColumnList;
  columnsContainer: ColumnsContainer;
  view: DataCollection;
  private direction = 'ltr';
  private _sort;
  private _group;
  private cachedWindowWidth;
  private defaultSelection;
  private selectionSubscription;
  private stateChangeSubscription;
  private groupExpandCollapseSubscription;
  private detailsServiceSubscription;
  private editServiceSubscription;
  private filterSubscription;
  private columnsChangeSubscription;
  private pdfSubscription;
  private resizeSubscription;
  private orientationSubscription;
  private excelSubscription;
  private columnsContainerChangeSubscription;

  public selectionDirective = false;

  constructor(supportService: BrowserSupportService,
              private selectionService: SelectionService,
              private wrapper: ElementRef,
              private groupInfoService: GroupInfoService,
              private groupsService: GroupsService,
              private changeNotification: ChangeNotificationService,
              private detailsService: DetailsService,
              private editService: EditService,
              private filterService: FilterService,
              private responsiveService: ResponsiveService,
              private renderer: Renderer2,
              private ngZone: NgZone,
              private scrollSyncService: ScrollSyncService) {
    this.columns = new QueryList<ColumnBase>();
    this.columnsContainer = new ColumnsContainer(() =>
      this.columnList.filter(column => !this.isHidden(column) && this.matchesMedia(column))
    );
    this.view = new DataCollection(() => new DataResultIterator(this.data, this.skip, this.showGroupFooters));
    this._sort = [];
    this._group = [];
    this.data = [];
    this.cachedWindowWidth = 0;
    this._rowClass = () => null;
    this.scrollbarWidth = supportService.scrollbarWidth;
    this.groupInfoService.registerColumnsContainer(() => this.columnList);
    if (selectionService) {
      this.selectionSubscription = selectionService.changes.subscribe(event => {
        this.selectionChange.emit(event);
      });
    }
    this.groupExpandCollapseSubscription = groupsService.changes
      .pipe(
        filter(_a => {
          const dataItem = _a.dataItem;
          return isPresent(dataItem);
        })
      )
      .subscribe(_a => {
        const expand = _a.expand;
        const group = _a.dataItem;
        return !expand ? this.groupExpand.emit({group}) : this.groupCollapse.emit({group});
      });
    this.detailsServiceSubscription = detailsService.changes
      .pipe(
        filter(({dataItem}) => {
          return isPresent(dataItem);
        })
      )
      .subscribe(({expand, dataItem, index}) => {
        return expand ? this.detailExpand.emit({dataItem, index}) : this.detailCollapse.emit({dataItem, index});
      });
    this.filterSubscription = this.filterService.changes.subscribe(x => {
      this.filterChange.emit(x);
    });
    this.attachStateChangesEmitter();
    this.attachEditHandlers();
    this.columnsContainerChangeSubscription = this.columnsContainer.changes
      .pipe(filter(() => this.totalColumnLevels > 0 && this.lockedColumns.length > 0))
      .subscribe(this.columnsContainerChange.bind(this));
    this.columnList = new ColumnList(this.columns);
  }

  @Input()
  get sort(): SortDescriptor[] {
    return this._sort;
  }

  set sort(value) {
    if (isArray(value)) {
      this._sort = value;
    }
  }

  @Input()
  get group(): GroupDescriptor[] {
    return this._group;
  }

  set group(value) {
    if (isArray(value)) {
      this._group = value;
    }
  }

  get showTopToolbar(): boolean {
    return this.toolbarTemplate && ['top', 'both'].includes(this.toolbarTemplate.position);
  }

  get showBottomToolbar(): boolean {
    return this.toolbarTemplate && ['bottom', 'both'].includes(this.toolbarTemplate.position);
  }

  get isLocked(): boolean {
    return this.lockedLeafColumns.length > 0;
  }

  get showPager(): boolean {
    return !this.isVirtual && this.pageable !== false;
  }

  get showGroupPanel(): boolean {
    return this.groupable && (<GroupableSettings>this.groupable).enabled !== false;
  }

  @Input()
  get rowClass(): RowClassFn {
    return this._rowClass;
  }

  set rowClass(fn) {
    if (!isFunction(fn)) {
      console.warn(`rowClass must be a function, but received ${JSON.stringify(fn)}.`);
    } else {
      this._rowClass = fn;
    }
  }

  @Input()
  get rowSelected(): RowSelectedFn {
    return this._RowSelected;
  }

  set rowSelected(fn) {
    if (!isFunction(fn)) {
      console.warn(`rowSelected must be a function, but received ${JSON.stringify(fn)}.`);
    } else {
      this._RowSelected = fn;
    }
  }

  get headerPadding(): any {
    const padding = `${this.scrollbarWidth}px`;
    const right = padding;
    const left = 0;
    return `0 ${right} 0 ${left}`;
  }

  get showGroupFooters(): boolean {
    return columnsToRender(this.columnList.toArray()).filter(column => column.groupFooterTemplateRef).length > 0;
  }

  get showFooter(): boolean {
    return this.columnList.filter(column => column.footerTemplateRef).length > 0;
  }

  get isVirtual(): boolean {
    return this.scrollable === 'virtual';
  }

  get isScrollable(): boolean {
    return this.scrollable !== 'none';
  }

  get visibleColumns(): QueryList<ColumnBase> {
    return this.columnsContainer.allColumns;
  }

  get lockedColumns(): QueryList<ColumnBase> {
    return this.columnsContainer.lockedColumns;
  }

  get nonLockedColumns(): QueryList<ColumnBase> {
    return this.columnsContainer.nonLockedColumns;
  }

  get lockedLeafColumns(): QueryList<ColumnBase> {
    return this.columnsContainer.lockedLeafColumns;
  }

  get nonLockedLeafColumns(): QueryList<ColumnBase> {
    return this.columnsContainer.nonLockedLeafColumns;
  }

  get leafColumns(): QueryList<ColumnBase> {
    return this.columnsContainer.leafColumns;
  }

  get totalColumnLevels(): number {
    return this.columnsContainer.totalLevels;
  }

  get lockedWidth(): number {
    const groupCellsWidth = this.group.length * 30; // this should be the value of group-cell inside the theme!
    return expandColumns(this.lockedLeafColumns.toArray()).reduce(
      (prev, curr) => prev + (curr.width || 0),
      groupCellsWidth
    );
  }

  get nonLockedWidth(): number {
    if (this.lockedLeafColumns.length) {
      return expandColumns(this.nonLockedLeafColumns.toArray()).reduce((prev, curr) => prev + (curr.width || 0), 0);
    }
    return undefined;
  }

  get selectableSettings() {
    if (this.selectionService) {
      return this.selectionService.options;
    }
    return undefined;
  }

  expandRow(index) {
    if (!this.detailsService.isExpanded(index)) {
      this.detailsService.toggleRow(index, null);
    }
  }

  collapseRow(index) {
    if (this.detailsService.isExpanded(index)) {
      this.detailsService.toggleRow(index, null);
    }
  }

  expandGroup(index) {
    if (!this.groupsService.isExpanded(index)) {
      this.groupsService.toggleRow(index, null);
    }
  }

  collapseGroup(index) {
    if (this.groupsService.isExpanded(index)) {
      this.groupsService.toggleRow(index, null);
    }
  }

  onDataChange() {
    this._autoGenerateColumns();
    this.changeNotification.notify();
    if (isPresent(this.defaultSelection)) {
      this.defaultSelection.reset();
    }
    this.initSelectionService();
  }

  ngOnChanges(changes) {
    if (isChanged('data', changes)) {
      this.onDataChange();
    }
    if (this.lockedLeafColumns.length && anyChanged(['pageSize', 'skip', 'sort', 'group'], changes)) {
      this.changeNotification.notify();
    }
  }

  ngAfterViewInit() {
    const resizeCheck = this.resizeCheck.bind(this);
    this.resizeSubscription = this.renderer.listen('window', 'resize', resizeCheck);
    this.orientationSubscription = this.renderer.listen('window', 'orientationchange', resizeCheck);
    this.attachScrollSync();
  }

  ngAfterContentChecked() {
    this.columnsContainer.refresh();
    this.verifySettings();
    this.initSelectionService();
  }

  ngAfterContentInit() {
    this._autoGenerateColumns();
    this.columnList = new ColumnList(this.columns);
    this.columnsChangeSubscription = this.columns.changes.subscribe(() => this.verifySettings());
  }

  ngOnDestroy() {
    if (this.selectionSubscription) {
      this.selectionSubscription.unsubscribe();
    }
    if (this.stateChangeSubscription) {
      this.stateChangeSubscription.unsubscribe();
    }
    if (this.groupExpandCollapseSubscription) {
      this.groupExpandCollapseSubscription.unsubscribe();
    }
    if (this.detailsServiceSubscription) {
      this.detailsServiceSubscription.unsubscribe();
    }
    if (this.editServiceSubscription) {
      this.editServiceSubscription.unsubscribe();
    }
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.columnsChangeSubscription) {
      this.columnsChangeSubscription.unsubscribe();
    }
    if (this.resizeSubscription) {
      this.resizeSubscription();
    }
    if (this.orientationSubscription) {
      this.orientationSubscription();
    }
    if (this.columnsContainerChangeSubscription) {
      this.columnsContainerChangeSubscription.unsubscribe();
    }
    if (this.scrollSyncService) {
      this.scrollSyncService.destroy();
    }
    //    if (this.documentClickSubscription) {
    //      this.documentClickSubscription();
    //    }
    //    if (this.windowBlurSubscription) {
    //      this.windowBlurSubscription();
    //    }
    if (this.defaultSelection) {
      this.defaultSelection.destroy();
    }
    //    if (this.cellClickSubscription) {
    //      this.cellClickSubscription.unsubscribe();
    //    }
    //    if (this.footerChangeSubscription) {
    //      this.footerChangeSubscription.unsubscribe();
    //    }
    //    this.ngZone = null;
    //    if (this.columnResizingSubscription) {
    //      this.columnResizingSubscription.unsubscribe();
    //    }
  }

  attachScrollSync() {
    if (isUniversal()) {
      return;
    }
    if (this.header) {
      this.scrollSyncService.registerEmitter(this.header.nativeElement, 'header');
    }
    if (this.footer) {
      this.scrollSyncService.registerEmitter(this.footer.nativeElement, 'footer');
    }
  }

  editRow(index, group?) {
    this.editService.editRow(index, group);
  }

  closeRow(index) {
    this.editService.close(index);
  }

  addRow(group) {
    const isFormGroup = group instanceof FormGroup;
    if (!isFormGroup) {
      const fields = Object.keys(group).reduce(createControl(group), {});
      group = new FormGroup(fields);
    }
    this.editService.addRow(group);
  }

  // todo
  editCell(rowIndex, column, group) {
    var instance = this.columnInstance(column);
    this.editService.editRow(rowIndex, group);
    //    this.focusEditElement('.ant-grid-edit-cell');
  }

  // todo
  closeCell() {
    this.editService.close();
  }

  // todo
  cancelCell() {
    this.editService.close();
  }

  //  autoFitColumn (column) {
  //    this.columnResizingService.autoFit(column);
  //  }

  //  autoFitColumns (columns) {
  //    if (columns === void 0) {
  //      columns = this.columns;
  //    }
  //    columns.forEach(this.autoFitColumn.bind(this));
  //  };

  notifyPageChange(source, event) {
    if (source === 'list' && !this.isVirtual) {
      return;
    }
    this.pageChange.emit(event);
  }

  //  focusEditElement(){}

  initSelectionService() {
    if (!this.selectionDirective && !isPresent(this.defaultSelection)) {
      this.defaultSelection = new Selection(this);
    }
    this.selectionService.init({
      rowSelected: this.rowSelected,
      selectable : this.selectable,
      view       : this.view
    });
    if (!this.selectionDirective && !this.selectableSettings.enabled) {
      this.defaultSelection.reset();
    }
  }

  //  setEditFocus (element) {
  //    if (element) {
  //      var focusable = findFocusable(element);
  //      if (focusable) {
  //        focusable.focus();
  //        return true;
  //      }
  //    }
  //  }

  columnInstance(column) {
    let instance;
    if (typeof column === 'number') {
      instance = this.columnList.filter(function (item) {
        return !item.isColumnGroup && !item.hidden;
      })[column];
    } else if (typeof column === 'string') {
      instance = this.columnList.filter(function (item) {
        return (item as ColumnComponent).field === column;
      })[0];
    } else {
      instance = column;
    }
    if (!instance && isDevMode()) {
      throw new Error('Invalid column ' + column);
    }
    return instance;
  }

  verifySettings() {
    if (isDevMode()) {
      if (this.lockedLeafColumns.length && this.detailTemplate) {
        throw new Error('Having both detail template and locked columns is not supported');
      }
      if (this.lockedLeafColumns.length && !this.nonLockedLeafColumns.length) {
        throw new Error('There should be at least one non locked column');
      }
      if (this.lockedLeafColumns.length && expandColumns(this.columnList.toArray()).filter(x => !x.width).length) {
        throw new Error('Locked columns feature requires all columns to have width set');
      }
      if (this.lockedLeafColumns.length && !this.isScrollable) {
        throw new Error('Locked columns are only supported when scrolling is enabled');
      }
      if (this.columnList.filter(isColumnGroupComponent).filter((x: any) => x.children.length < 2).length) {
        throw new Error('ColumnGroupComponent should contain ColumnComponent or CommandColumnComponent');
      }
      if (this.columnList.filter(x => x.locked && x.parent && !x.parent.isLocked).length) {
        throw new Error('Locked child columns require their parent columns to be locked.');
      }
      if ((this.rowHeight || this.detailRowHeight) && !this.isVirtual) {
        throw new Error('Row height and detail row height settings requires virtual scrolling mode to be enabled.');
      }
    }
  }

  _autoGenerateColumns() {
    // check field define column
    const fieldColumns = [];
    const otherColumns = [];

    this.columns.forEach(column => {
      if (column instanceof ColumnComponent) {
        fieldColumns.push(column);
      }
      otherColumns.push(column);
    });

    const order = ['start', 'middle', 'end'];
    if (this.view.length && (!this.columns.length || this.autoGenerateColumns) && !this._hasGeneratedColumn) {
      let keys;
      if (isObject(this.fieldMap)) {
        keys = Object.keys(this.fieldMap);
      } else {
        keys = Object.keys(this.view.at(0));
      }
      this.columns.reset(
        keys
          .map(field => {
            const column = new ColumnComponent();
            column.field = field;
            if (isFunction(this.fieldMap)) {
              column.title = (this.fieldMap as fieldMapFn)(field);
            } else if (isObject(this.fieldMap)) {
              column.title = fieldMapFnObjectFactory(this.fieldMap)(field);
            }
            return column;
          })
          .concat(otherColumns)
          .sort((a: ColumnBase, b: ColumnBase) => {
            let Pa = a.autoGenerateColumnPosition;
            let Pb = b.autoGenerateColumnPosition;
            if (!order.includes(Pa)) Pa = 'middle';
            if (!order.includes(Pb)) Pb = 'middle';
            return order.indexOf(Pa) - order.indexOf(Pb);
          })
      );
      this._hasGeneratedColumn = true;
    }
  }

  attachStateChangesEmitter() {
    this.stateChangeSubscription = this.pageChange
      .pipe(
        map(x => ({
          filter: this.filter,
          group : this.group,
          skip  : x.skip,
          sort  : this.sort,
          take  : x.take
        })),
        merge(
          this.sortChange.pipe(
            map(sort => ({
              filter: this.filter,
              group : this.group,
              skip  : this.skip,
              sort,
              take  : this.pageSize
            }))
          )
        ),
        merge(
          this.groupChange.pipe(
            map(group => ({
              filter: this.filter,
              group,
              skip  : this.skip,
              sort  : this.sort,
              take  : this.pageSize
            }))
          )
        ),
        merge(
          this.filterChange.pipe(
            map(filter => ({
              filter,
              group: this.group,
              skip : 0,
              sort : this.sort,
              take : this.pageSize
            }))
          )
        )
      )
      .subscribe(x => this.dataStateChange.emit(x));
  }

  attachEditHandlers() {
    if (!this.editService) {
      return;
    }
    this.editServiceSubscription = this.editService.changes.subscribe(this.emitCRUDEvent.bind(this));
  }

  emitCRUDEvent(_a) {
    const action = _a.action;
    const rowIndex = _a.rowIndex;
    const formGroup = _a.formGroup;
    const isNew = _a.isNew;
    let dataItem = this.view.at(rowIndex - this.skip);
    if (action !== 'add' && !dataItem) {
      dataItem = formGroup.value;
    }
    const args = {
      dataItem,
      formGroup,
      isNew,
      rowIndex,
      sender: this
    };
    switch (action) {
      case 'add':
        this.add.emit(args);
        break;
      case 'cancel':
        this.cancel.emit(args);
        break;
      case 'edit':
        this.edit.emit(args);
        break;
      case 'remove':
        this.remove.emit(args);
        break;
      case 'save':
        this.save.emit(args);
        break;
      default:
        break;
    }
  }

  isHidden(c) {
    return c.hidden || (c.parent && this.isHidden(c.parent));
  }

  matchesMedia(c) {
    const matches = this.responsiveService.matchesMedia(c.media);
    return matches && (!c.parent || this.matchesMedia(c.parent));
  }

  resizeCheck() {
    if (window.innerWidth !== this.cachedWindowWidth) {
      this.cachedWindowWidth = window.innerWidth;
      this.columnsContainer.refresh();
      this.verifySettings();
    }
  }

  columnsContainerChange() {
    this.ngZone.onStable.take(1).subscribe(() => {
      if (this.lockedHeader) {
        syncRowsHeight(this.lockedHeader.nativeElement.children[0], this.header.nativeElement.children[0]);
      }
    });
  }
}
