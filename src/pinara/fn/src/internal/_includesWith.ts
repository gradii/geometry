/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _includesWith(pred, x, list) {
  let idx = 0;
  let len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}
