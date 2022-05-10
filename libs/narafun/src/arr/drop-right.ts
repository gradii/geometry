/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { slice } from './slice';
import { toInteger } from './to-integer';

/**
 * Creates a slice of `array` with `n` elements dropped from the end.
 *
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * dropRight([1, 2, 3])
 * // => [1, 2]
 *
 * dropRight([1, 2, 3], 2)
 * // => [1]
 *
 * dropRight([1, 2, 3], 5)
 * // => []
 *
 * dropRight([1, 2, 3], 0)
 * // => [1, 2, 3]
 */
export function dropRight(array, n= 1) {
  const length = array == null ? 0 : array.length;
  n = length - toInteger(n);
  return length ? slice(array, 0, n < 0 ? 0 : n) : [];
}


