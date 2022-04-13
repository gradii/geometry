/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ArrayIterator } from './array-iterator';
import { Iterator } from './iterator';
import { MapIterator } from './map-iterator';

export class SortIterator extends Iterator {
  protected iter;
  protected rules: Array<{ getter: Function, desc: boolean }>;
  protected sortedIter;

  constructor(iter, getter, desc) {
    super();
    if (!(iter instanceof MapIterator)) {
      iter = new MapIterator(iter, this._wrap);
    }
    this.iter = iter;
    this.rules = [{
      getter: getter,
      desc  : desc
    }];
  }

  thenBy(getter, desc) {
    const result = new SortIterator(this.sortedIter || this.iter, getter, desc);
    if (!this.sortedIter) {
      result.rules = this.rules.concat(result.rules);
    }
    return result;
  }

  next() {
    this._ensureSorted();
    return this.sortedIter.next();
  }

  current() {
    this._ensureSorted();
    return this.sortedIter.current();
  }

  reset() {
    delete this.sortedIter;
  }

  countable() {
    return this.sortedIter || this.iter.countable();
  }

  count() {
    if (this.sortedIter) {
      return this.sortedIter.count();
    }
    return this.iter.count();
  }

  _ensureSorted() {
    if (this.sortedIter) {
      return;
    }

    this.sortedIter = new MapIterator(new ArrayIterator(this.iter.toArray().sort((x, y) => {
      return this._compare(x, y);
    })), this._unwrap);
  }

  _wrap(record, index) {
    return {
      index: index,
      value: record
    };
  }

  _unwrap(wrappedItem) {
    return wrappedItem.value;
  }

  _compare(x, y) {
    const xIndex = x.index,
          yIndex = y.index;
    x = x.value;
    y = y.value;
    if (x === y) {
      return xIndex - yIndex;
    }
    let i = 0;
    const rulesCount = this.rules.length;
    for (; i < rulesCount; i++) {
      const rule   = this.rules[i],
            xValue = rule.getter(x),
            yValue = rule.getter(y);
      const factor = rule.desc ? -1 : 1;
      if (null === xValue && null !== yValue) {
        return -factor;
      }
      if (null !== xValue && null === yValue) {
        return factor;
      }
      if (void 0 === xValue && void 0 !== yValue) {
        return factor;
      }
      if (void 0 !== xValue && void 0 === yValue) {
        return -factor;
      }
      if (xValue < yValue) {
        return -factor;
      }
      if (xValue > yValue) {
        return factor;
      }
    }
    return xIndex - yIndex;
  }
}
