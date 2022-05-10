/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseXor } from '../../_internal/base-xor';
import { isArrayLikeObject } from './is-array-like-object';

/**
 * Creates an array of unique values that is the
 * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
 * of the given arrays. The order of result values is determined by the order
 * they occur in the arrays.
 *
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of filtered values.
 * @see difference, union, unionBy, unionWith, without, xorBy, xorWith
 * @example
 *
 * xor([2, 1], [2, 3])
 * // => [1, 3]
 */
export function xor(...arrays) {
  return baseXor(arrays.filter(isArrayLikeObject));
}


