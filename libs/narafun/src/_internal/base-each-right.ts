/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseForOwnRight } from './base-for-own-right';
import { isArrayLike } from '../is-array-like';

/**
 * The base implementation of `forEachRight`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
export function baseEachRight(collection, iteratee) {
  if (collection == null) {
    return collection;
  }
  if (!isArrayLike(collection)) {
    return baseForOwnRight(collection, iteratee);
  }
  const iterable = Object(collection);
  let length = collection.length;

  while (length--) {
    if (iteratee(iterable[length], length, iterable) === false) {
      break;
    }
  }
  return collection;
}


