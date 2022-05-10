/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { getTag } from './_internal/get-tag';
import { isObjectLike } from './is-object-like';

/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
 * @example
 *
 * isBoolean(false)
 * // => true
 *
 * isBoolean(null)
 * // => false
 */
export function isBoolean(value) {
  return value === true || value === false ||
    (isObjectLike(value) && getTag(value) == '[object Boolean]');
}


