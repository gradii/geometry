/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseConformsTo } from './base-conforms-to';
import { keys } from '../keys';

/**
 * The base implementation of `conforms` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property predicates to conform to.
 * @returns {Function} Returns the new spec function.
 */
export function baseConforms(source) {
  const props = keys(source);
  return (object) => baseConformsTo(object, source, props);
}


