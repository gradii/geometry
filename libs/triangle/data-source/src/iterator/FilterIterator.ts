import { WrappedIterator } from './WrappedIterator';

export class FilterIterator extends WrappedIterator {

  /**
   *
   * @param iter
   * @param predicate compiled criteria
   */
  constructor(protected iter, protected predicate) {
    super(iter);
  }

  next() {
    while (this.iter.next()) {
      if (this.predicate(this.current())) {
        return true;
      }
    }
    return false;
  }
}
