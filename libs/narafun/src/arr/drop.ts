/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { slice } from './slice';
import { toInteger } from './to-integer';

/**
 * Creates a slice of `array` with `n` elements dropped from the beginning.
 *
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * drop([1, 2, 3])
 * // => [2, 3]
 *
 * drop([1, 2, 3], 2)
 * // => [3]
 *
 * drop([1, 2, 3], 5)
 * // => []
 *
 * drop([1, 2, 3], 0)
 * // => [1, 2, 3]
 */
export function drop(array, n= 1) {
  const length = array == null ? 0 : array.length;
  return length
    ? slice(array, n < 0 ? 0 : toInteger(n), length)
    : [];
}


