/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _isArrayLike from './_isArrayLike.js';


/**
 * `_makeFlat` is a helper function that returns a one-level or fully recursive
 * function based on the flag passed in.
 *
 * @private
 */
export default function _makeFlat(recursive) {
  return function flatt(list) {
    let value, jlen, j;
    let result = [];
    let idx = 0;
    let ilen = list.length;

    while (idx < ilen) {
      if (_isArrayLike(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;
        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  };
}
