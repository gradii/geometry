/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseFlatten } from './_internal/base-flatten';

/**
 * Flattens `array` a single level deep.
 *
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @see flatMap, flatMapDeep, flatMapDepth, flattenDeep, flattenDepth
 * @example
 *
 * flatten([1, [2, [3, [4]], 5]])
 * // => [1, 2, [3, [4]], 5]
 */
export function flatten(array) {
  const length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}


