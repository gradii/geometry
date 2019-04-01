import { CompositeFilterDescriptor, GroupDescriptor, GroupResult, SortDescriptor } from '@gradii/triangle/data-query';
import {
  AddEvent,
  CancelEvent,
  DataStateChangeEvent,
  EditEvent,
  fieldMapFn,
  GridDataResult,
  GroupableSettings,
  PageChangeEvent,
  RemoveEvent,
  RowArgs,
  RowClassFn,
  RowSelectedFn,
  SaveEvent,
  ScrollMode,
  SelectableSettings,
  SelectionEvent,
  SortSettings
} from '@gradii/triangle/data-table';
import { EventEmitter, Input, Output, TemplateRef } from '@angular/core';

export class BaseInputOutputDataTable {
  @Input() data: any[] | GridDataResult;
  @Input() take: number;
  @Input() height: number;
  @Input() rowHeight: number;
  @Input() detailRowHeight: number;
  @Input() skip = 0;
  @Input() scrollable: ScrollMode = 'scrollable';
  @Input() selectable: boolean | SelectableSettings = false;
  @Input() filter: CompositeFilterDescriptor;
  @Input() filterable = false;
  @Input() resizable = true;
  @Input() sortable: SortSettings = false;
  @Input() pageable: boolean = false;
  @Input() groupable: GroupableSettings | boolean = false;
  @Input() sort: SortDescriptor[];
  @Input() group: GroupDescriptor[];
  @Input() rowClass: RowClassFn;
  @Input() rowSelected: RowSelectedFn;
  @Input() fieldMap: fieldMapFn;

  @Input() selectedKeys: any[] = [];
  @Input() selectedBy: string | ((context: RowArgs) => any);

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
  @Output() selectedKeysChange: EventEmitter<any[]> = new EventEmitter();
  @Output() autoGenerateColumnsChange: EventEmitter<any[]> = new EventEmitter();
}
