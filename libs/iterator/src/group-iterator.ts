/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ArrayIterator } from './array-iterator';
import { Iterator } from './iterator';

export class GroupIterator extends Iterator {
  protected iter;
  protected getters = [];

  protected groupedIter;

  constructor(iter, getters) {
    super();
    this.iter = iter;
    if (Array.isArray(getters)) {
      this.getters = getters;
    } else {
      this.getters.push(getters);
    }
  }

  thenBy(getter) {
    this.reset();
    this.getters.push(getter);
    return this;
  }

  next() {
    this._ensureGrouped();
    return this.groupedIter.next();
  }

  current() {
    this._ensureGrouped();
    const groupItem = this.groupedIter.current();
    if (groupItem.items instanceof GroupIterator) {
      groupItem.items = groupItem.items.toArray();
    }
    return this.groupedIter.current();
  }

  reset() {
    delete this.groupedIter;
  }

  countable() {
    return !!this.groupedIter;
  }

  count() {
    return this.groupedIter.count();
  }

  _ensureGrouped() {
    if (this.groupedIter) {
      return;
    }
    const groupData = [];
    this.iter.reset();
    while (this.iter.next()) {
      const current = this.iter.current();
      this._deepGetter(groupData, current, 0);
    }
    this.groupedIter = new ArrayIterator(groupData);
  }

  _deepGetter(parent, current, deep) {
    if (deep < this.getters.length) {
      const getter = this.getters[deep];
      const key = getter(current);
      let subItem = parent.find((subItem) => {
        return subItem.key === key;
      });
      if (!subItem) {
        subItem = {key: key, items: []};
        parent.push(subItem);
      }
      this._deepGetter(subItem.items, current, deep + 1);
    } else {
      parent.push(current);
    }
  }
}
