import { GroupResult } from '@gradii/triangle/data-query';
import { isPresent } from '@gradii/triangle/util';

export interface GroupItem {
  type: 'group';
  data: GroupResult;
  index: string;
  level: number;
}

export interface GroupFooterItem {
  type: 'footer';
  data: GroupResult;
  groupIndex: string;
  level: number;
}

export interface Item {
  type: 'data';
  data: Object;
  index: number;
  groupIndex: string;
}

export interface HierarchyItem {
  type: 'hierarchy-data';
  data: Object;
  index: number;
  groupIndex: string;
  children: HierarchyItem[]
}

export interface IteratorResult<T> {
  done: boolean;
  value: T;
}

export interface IteratorState {
  footers?: boolean;
  level?: number;
  dataIndex?: number;
  parentGroupIndex?: string;
  groupIndex?: number;
}

/*

const isGroupItem = function (source) {
  return source.items !== undefined && source.field !== undefined;
};
const flattenGroups = function (groups) {
  return groups.reduce(function (acc, curr) {
    if (isGroupItem(curr)) {
      return acc.concat(flattenGroups(curr.items));
    }
    return acc.concat([curr]);
  }, []); // tslint:disable-line:align
};
export const itemAt = (data: any[], index: number): any => {
  const first = data[0];
  if (isPresent(first) && isGroupItem(first)) {
    return flattenGroups(data)[index];
  }
  return data[index];
};
export const getIterator = (data: any[],
                            {footers, level, dataIndex, parentGroupIndex, groupIndex}: IteratorState): any => {
  const first = data[0];
  if (isPresent(first) && isGroupItem(first)) {
    // tslint:disable-next-line:no-use-before-declare
    return new GroupIterator(data, footers, level, dataIndex, parentGroupIndex, groupIndex);
  }
  // tslint:disable-next-line:no-use-before-declare
  return new ItemIterator(data, dataIndex, parentGroupIndex);
};

class ArrayIterator {
  protected arr;
  protected idx;

  constructor(arr, idx = 0) {
    this.arr = arr;
    this.idx = idx;
    this.arr = arr || [];
  }

  next() {
    return this.idx < this.arr.length
      ? {
        done : false,
        value: this.arr[this.idx++]
      }
      : {done: true, value: undefined};
  }

  [Symbol.iterator]() {
    return this;
  }
}

export class Iterator<T> {
  protected dataIndex: number;
  private resultMap;
  protected _innerIterator: any;

  constructor(arr: any[], dataIndex: number = 0, resultMap: (x: T, idx: number) => T = x => x) {
    this.dataIndex = dataIndex;
    this.resultMap = resultMap;
    const iterator = arr[Symbol.iterator];
    this._innerIterator = iterator ? arr[Symbol.iterator]() : new ArrayIterator(arr);
  }

  next(): IteratorResult<T> {
    return this.resultMap(this._innerIterator.next(), this.dataIndex++);
  }

  [Symbol.iterator]() {
    return this;
  }
}

export class ItemIterator extends Iterator<IteratorResult<Item | GroupItem | GroupFooterItem>> {
  constructor(arr: any[], dataIndex: number, groupIndex: string) {
    super(arr, dataIndex, (x: IteratorResult<Item | GroupItem | GroupFooterItem>, idx): IteratorResult<Item | GroupItem | GroupFooterItem> => ({
      done : x.done,
      value: {
        data : x.value,
        groupIndex,
        index: idx,
        type : 'data'
      }
    }));
  }

  get index() {
    return this.dataIndex;
  }
}

const prefix = function (s, n) {
  const p = s ? s + '_' : s;
  return '' + p + n;
};

export class GroupIterator<T> {
  private arr;
  private outputFooters;
  private level;
  private dataIndex;
  private parentIndex;
  private groupIndex;
  private current;
  private _innerIterator;
  private _iterator;
  private currentGroupIndex;

  constructor(arr: Array<GroupResult>,
              outputFooters: boolean = false,
              level: number          = 0,
              dataIndex: number      = 0,
              parentIndex: string    = '',
              groupIndex: number     = 0) {
    this.arr = arr;
    this.outputFooters = outputFooters;
    this.level = level;
    this.dataIndex = dataIndex;
    this.parentIndex = parentIndex;
    this.groupIndex = groupIndex;
    this.currentGroupIndex = '';
    this.arr = arr || [];
    this._iterator = new Iterator(this.arr, this.dataIndex);
  }

  nextGroupItem(): IteratorResult<GroupItem> {
    this.current = this._iterator.next().value;
    this._innerIterator = null;
    if (this.current) {
      this.currentGroupIndex = prefix(this.parentIndex, this.groupIndex++);
      return {
        done : false,
        value: {
          data : this.current,
          index: this.currentGroupIndex,
          level: this.level,
          type : 'group'
        }
      };
    } else {
      this.current = null;
      return {done: true, value: undefined};
    }
  }

  footerItem(): IteratorResult<GroupFooterItem> {
    if (this.current) {
      const group = this.current;
      this.current = null;
      return {
        done : false,
        value: {
          data      : group,
          groupIndex: this.currentGroupIndex,
          level     : this.level,
          type      : 'footer'
        }
      };
    } else {
      this.current = null;
      return {done: true, value: undefined};
    }
  }

  innerIterator(group: GroupResult): GroupIterator<T> | ItemIterator {
    if (!this._innerIterator) {
      this._innerIterator = getIterator(group.items, {
        dataIndex       : this.dataIndex,
        footers         : this.outputFooters,
        level           : this.level + 1,
        parentGroupIndex: this.currentGroupIndex
      });
    }
    return this._innerIterator;
  }

  nextDataItem(group: GroupResult): IteratorResult<Item | GroupItem | GroupFooterItem> {
    const iterator = this.innerIterator(group);
    const currentIndex = iterator.index;
    const result = iterator.next();
    if (isPresent(result.value) && (<any>result.value).type !== 'footer') {
      this.dataIndex = currentIndex;
    }
    return !result.done ? <IteratorResult<Item | GroupItem | GroupFooterItem>>result : undefined;
  }

  next(): IteratorResult<Item | GroupItem | GroupFooterItem> {
    if (!isPresent(this.current)) {
      return this.nextGroupItem();
    }
    const item = this.nextDataItem(this.current);
    return item ? item : this.outputFooters ? this.footerItem() : this.nextGroupItem();
  }

  get index(): number {
    return this.dataIndex + 1;
  }

  [Symbol.iterator]() {
    return this;
  }
}
*/
