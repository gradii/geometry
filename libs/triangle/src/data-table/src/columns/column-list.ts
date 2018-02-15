import { QueryList } from '@angular/core';
import { ColumnBase } from './column-base';

const forEachColumn = function (list, callback) {
  list.forEach(function (column) {
    callback(column);
    if (column.children && column.children.length > 1) {
      forEachColumn(column.children.toArray().slice(1), callback);
    }
  });
};

export class ColumnList {
  private columns;

  static empty(): ColumnList {
    return new ColumnList(new QueryList<ColumnBase>());
  }

  constructor(columns: QueryList<ColumnBase>) {
    this.columns = columns;
  }

  forEach(callback: (column: ColumnBase) => void): void {
    forEachColumn(this.columns, callback);
  }

  filter(callback: (column: ColumnBase) => any): ColumnBase[] {
    const result = [];
    forEachColumn(this.columns, column => {
      if (callback(column)) {
        result.push(column);
      }
    });
    return result;
  }

  toArray(): ColumnBase[] {
    const result = [];
    forEachColumn(this.columns, column => {
      result.push(column);
    });
    return result;
  }
}
