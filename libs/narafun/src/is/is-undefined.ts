/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * Checks if `value` is `undefined`.
 *
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * isUndefined(void 0)
 * // => true
 *
 * isUndefined(null)
 * // => false
 */
export function isUndefined(value) {
  return value === undefined;
}


