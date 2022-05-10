/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { getTag } from './_internal/get-tag';
import { isObjectLike } from './is-object-like';
import { nodeTypes } from './_internal/node-types';

/* Node.js helper references. */
const nodeIsDate = nodeTypes && nodeTypes.isDate;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 * @example
 *
 * isDate(new Date)
 * // => true
 *
 * isDate('Mon April 23 2012')
 * // => false
 */
const isDate = nodeIsDate
  ? (value) => nodeIsDate(value)
  : (value) => isObjectLike(value) && getTag(value) == '[object Date]';

export default isDate;
