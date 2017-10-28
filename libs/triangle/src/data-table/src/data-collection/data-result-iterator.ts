import { DataResult } from '@gradii/triangle/data-query';
import { getIterator } from './data.iterators';
import { isPresent } from "../utils";

export interface GridDataResult extends DataResult {}

export class DataResultIterator {
  private isObject;

  constructor(private source: GridDataResult | any[] = [],
              private skip: number                   = 0,
              private groupFooters: boolean          = false) {
    if (!isPresent(source)) {
      this.source = [];
    }
    this.isObject = this.isGridDataResult(this.source);
  }

  isGridDataResult(source: GridDataResult | any): source is GridDataResult {
    return source.total !== undefined && source.data !== undefined;
  }

  get total(): number {
    return this.isObject ? (this.source as GridDataResult).total : (this.source as any[]).length;
  }

  get data(): any[] {
    return this.isObject ? (this.source as GridDataResult).data : this.source as any[];
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

  [Symbol.iterator]() {
    return getIterator(this.data, {
      dataIndex : this.skip,
      footers   : this.groupFooters,
      groupIndex: this.skip
    });
  }
}
