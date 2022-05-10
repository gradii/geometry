/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseFindIndex } from './base-find-index';
import { baseIsNaN } from './base-is-nan';
import { strictIndexOf } from './strict-index-of';

/**
 * The base implementation of `indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
export function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}


