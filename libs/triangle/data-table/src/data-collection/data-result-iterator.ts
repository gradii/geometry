import { DataResult, GroupDescriptor } from '@gradii/triangle/data-query';
import { isFunction, isPresent, isString, isIterable } from '@gradii/triangle/util';
import { Iterable as IterableX } from 'ix';
import { GroupRow } from '../row-column/group-row';
import { Row } from '../row-column/row';

export interface GridDataResult extends DataResult {
}

export class DataResultIterator<T> implements Iterable<T> {
  private _data: any[];
  private _total = Infinity;

  private _cachedData: Array<T>;

  private iterator;

  constructor(private source: GridDataResult | any[] = [],
              private groups: GroupDescriptor[],
              private skip: number = 0,
              // private groupFooters: boolean          = false,
              private childItemsPath: string | Function) {

    if (!isPresent(source)) {
      this.source = [];
    }
    if (this.isGridDataResult(this.source)) {
      this._data = this.source.data;
      this._total = (this.source as GridDataResult).total;
    } else {
      this._data = this.source;
    }

    this.iterator = IterableX.defer(() => this._bindRow())
      .map((row, idx) => {
        row._idx = idx;
        return row;
      })
      .publish()
      .memoize();
  }

  isGridDataResult(source: GridDataResult | any): source is GridDataResult {
    return source.total !== undefined && source.data !== undefined;
  }

  get total(): number {
    return this._total;
  }

  set total(value) {
    this._total = value;
  }

  get data(): any[] {
    if (!this._cachedData) {
      this._cachedData = this.iterator.toArray();
    }
    return this._cachedData;
  }

  map(fn: (item: any, index: number, array: any[]) => any): any[] {
    return this.data.map(fn);
  }

  filter(fn: (item: any, index: number, array: any[]) => boolean): any[] {
    return this.data.filter(fn);
  }

  reduce(fn: (prevValue: any, curValue: any, curIndex: number, array: any[]) => any, init: any): any {
    return this.data.reduce(fn, init);
  }

  forEach(fn: (item: any, index: number, array: any[]) => void): void {
    this.data.forEach(fn);
  }

  some(fn: (value: any, index: number, array: any[]) => boolean): boolean {
    return this.data.some(fn);
  }

  toString(): string {
    return this.data.toString();
  }

  private* _bindRow() {
    if (this._data) {
      const list = this._data;
      const groups = this.groups;

      // bind to hierarchical sources (childItemsPath)
      if (this.childItemsPath) {
        for (let item of list) {
          yield* this._addTreeNode(item, 0);
        }

        // bind to grouped sources
      } else if (groups != null && groups.length > 0 /*&& this.showGroups*/) {
        for (let item of groups) {
          yield* this._addGroup(item);
        }

        // bind to regular sources
      } else {
        if (isIterable(list)) {
          for (let item of list) {
            yield new Row(item);
          }
        }else{
          throw new Error('the data from list is not iterable')
        }
      }
    }
  }

  private* _addGroup(g) {

    // add group row
    const gr = new GroupRow();
    gr.level = g.level;
    gr.dataItem = g;
    yield gr;

    // add child rows
    if (g.isBottomLevel) {
      for (var i = 0; i < g.items.length; i++) {
        yield new Row(g.items[i]);
      }
    } else {
      for (var i = 0; i < g.groups.length; i++) {
        yield* this._addGroup(g.groups[i]);
      }
    }
  }

  private* _addTreeNode(item: any, level: number, parent?: GroupRow | Row) {
    var gr = new Row(parent),
      children = this.getChildren(item, this.childItemsPath);

    // add main node
    gr.dataItem = item;
    gr.level = level;
    yield gr;

    // add child nodes
    if (children) {
      for (var i = 0; i < children.length; i++) {
        const child = yield* this._addTreeNode(children[i], level + 1, gr);
        gr.children.push(child);
      }
    }

    gr.isCollapsed = true;

    return gr;
  }

  private getChildren(item, childItemPath) {
    if (isString(childItemPath)) {
      return Reflect.get(item, childItemPath);
    } else if (isFunction(childItemPath)) {
      return childItemPath(item);
    }
  }

  [Symbol.iterator](): Iterator<T> {
    return this.iterator[Symbol.iterator]();
    // return getIterator(this.data, {
    //   dataIndex : this.skip,
    //   footers   : this.groupFooters,
    //   groupIndex: this.skip
    // });
  }
}
