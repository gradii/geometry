/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * Checks if `value` is `null`.
 *
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * isNull(null)
 * // => true
 *
 * isNull(void 0)
 * // => false
 */
export function isNull(value) {
  return value === null;
}


