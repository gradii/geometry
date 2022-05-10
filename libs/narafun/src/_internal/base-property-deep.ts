/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { baseGet } from './base-get';

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
export function basePropertyDeep(path) {
  return (object) => baseGet(object, path);
}


