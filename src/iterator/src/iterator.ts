/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export abstract class Iterator {
  toArray() {
    const result = [];
    this.reset();
    while (this.next()) {
      result.push(this.current());
    }
    return result;
  }

  countable() {
    return false;
  }

  abstract reset(): any;

  abstract next(): any;

  abstract current(): any;
}
