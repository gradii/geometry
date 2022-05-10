/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseFindIndex } from './_internal/base-find-index';
import { baseIsNaN } from './_internal/base-is-nan';
import { strictLastIndexOf } from './_internal/strict-last-index-of';
import { toInteger } from './to-integer';

/**
 * This method is like `indexOf` except that it iterates over elements of
 * `array` from right to left.
 *
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * lastIndexOf([1, 2, 1, 2], 2)
 * // => 3
 *
 * // Search from the `fromIndex`.
 * lastIndexOf([1, 2, 1, 2], 2, 2)
 * // => 1
 */
export function lastIndexOf(array, value, fromIndex) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = length;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = index < 0 ? Math.max(length + index, 0) : Math.min(index, length - 1);
  }
  return value === value
    ? strictLastIndexOf(array, value, index)
    : baseFindIndex(array, baseIsNaN, index, true);
}


