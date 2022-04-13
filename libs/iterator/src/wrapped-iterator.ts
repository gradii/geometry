/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Iterator } from './iterator';

export class WrappedIterator extends Iterator {
  protected iter;

  constructor(iter) {
    super();
    this.iter = iter;
  }

  next() {
    return this.iter.next();
  }

  current() {
    return this.iter.current();
  }

  reset() {
    return this.iter.reset();
  }
}
