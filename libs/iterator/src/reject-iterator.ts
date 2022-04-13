/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { WrappedIterator } from './wrapped-iterator';

export class RejectIterator extends WrappedIterator {
  protected iter;
  protected predicate;

  /**
   *
   * @param iter
   * @param predicate compiled criteria
   */
  constructor(iter, predicate) {
    super(iter);
    this.predicate = predicate;
  }

  next() {
    while (this.iter.next()) {
      if (!this.predicate(this.current())) {
        return true;
      }
    }
    return false;
  }
}
