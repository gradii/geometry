/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseFor } from './base-for';
import { keys } from '../keys';

/**
 * The base implementation of `forOwn`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
export function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}


