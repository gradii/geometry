/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _map(fn, functor) {
  let idx = 0;
  let len = functor.length;
  let result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}
