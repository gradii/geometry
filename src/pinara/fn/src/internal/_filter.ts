/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _filter(fn, list) {
  let idx = 0;
  let len = list.length;
  let result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
}
