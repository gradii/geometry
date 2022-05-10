/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * The base implementation of `propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
export function basePropertyOf(object) {
  return (key) => object == null ? undefined : object[key];
}


