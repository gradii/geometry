/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { WrappedIterator } from './wrapped-iterator';

export class SelectIterator extends WrappedIterator {
  protected getter;

  constructor(iter, getter) {
    super(iter);
    this.getter = getter;
  }

  current() {
    return this.getter(super.current());
  }

  countable() {
    return this.iter.countable();
  }

  count() {
    return this.iter.count();
  }
}
