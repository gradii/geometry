import { GroupDescriptor } from '@gradii/triangle/data-query';
import { expandColumns } from '../helper/column-common';
import { ColumnList } from '../columns/column-list';
import { isColumnComponent } from '../columns/column.component';
import { GroupItem } from '../data-collection/data.iterators';
export class GroupInfoService {
  private _columnList;
  constructor() {
    this._columnList = ColumnList.empty;
  }
  get columns() {
    return expandColumns(this._columnList().toArray()).filter(isColumnComponent);
  }
  registerColumnsContainer(columns: () => ColumnList): void {
    this._columnList = columns;
  }
  formatForGroup(item: GroupItem | GroupDescriptor): string {
    const column = this.columnForGroup(item);
    return column ? column.format : '';
  }
  groupTitle(item: GroupItem | GroupDescriptor): string {
    const column = this.columnForGroup(item);
    return column ? column.title || column.field : this.groupField(item);
  }
  groupHeaderTemplate(item: GroupItem | GroupDescriptor): any {
    const column = this.columnForGroup(item);
    return column ? column.groupHeaderTemplateRef : undefined;
  }
  private groupField(group) {
    return group.data ? group.data.field : group.field;
  }
  private columnForGroup(group) {
    const field = this.groupField(group);
    const column = this.columns.filter(x => x.field === field)[0];
    return column;
  }
}
