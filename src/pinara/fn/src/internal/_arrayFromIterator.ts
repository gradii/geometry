/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _arrayFromIterator(iter) {
  let list = [];
  let next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}
