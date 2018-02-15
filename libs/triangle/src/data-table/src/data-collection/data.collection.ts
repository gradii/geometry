import { DataResultIterator } from './data-result-iterator';
import { itemAt } from './data.iterators';

export class DataCollection {
  private accessor;

  constructor(accessor: () => DataResultIterator) {
    this.accessor = accessor;
  }

  get total() {
    return this.accessor().total;
  }

  get length() {
    return this.accessor().data.length;
  }

  get first() {
    return this.accessor().data[0];
  }

  get last() {
    return this.accessor().data[this.length - 1];
  }

  at(index: number): any {
    return itemAt(this.accessor().data, index);
  }

  map(fn: (item: any, index: number, array: any[]) => any): any[] {
    return this.accessor().map(fn);
  }

  filter(fn: (item: any, index: number, array: any[]) => boolean): any[] {
    return this.accessor().filter(fn);
  }

  reduce(fn: (prevValue: any, curValue: any, curIndex: number, array: any[]) => any, init: any): any {
    return this.accessor().reduce(fn, init);
  }

  forEach(fn: (item: any, index: number, array: any[]) => void): void {
    this.accessor().forEach(fn);
  }

  some(fn: (value: any, index: number, array: any[]) => boolean): boolean {
    return this.accessor().some(fn);
  }

  toString(): string {
    return this.accessor().toString();
  }

  [Symbol.iterator]() {
    return this.accessor()[Symbol.iterator]();
  }
}
