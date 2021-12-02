/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _aperture(n, list) {
  let idx = 0;
  let limit = list.length - (n - 1);
  let acc = new Array(limit >= 0 ? limit : 0);
  while (idx < limit) {
    acc[idx] = Array.prototype.slice.call(list, idx, idx + n);
    idx += 1;
  }
  return acc;
}
