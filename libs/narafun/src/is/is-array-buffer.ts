/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { getTag } from './_internal/get-tag';
import { isObjectLike } from './is-object-like';
import { nodeTypes } from './_internal/node-types';

/* Node.js helper references. */
const nodeIsArrayBuffer = nodeTypes && nodeTypes.isArrayBuffer;

/**
 * Checks if `value` is classified as an `ArrayBuffer` object.
 *
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 * @example
 *
 * isArrayBuffer(new ArrayBuffer(2))
 * // => true
 *
 * isArrayBuffer(new Array(2))
 * // => false
 */
const isArrayBuffer = nodeIsArrayBuffer
  ? (value) => nodeIsArrayBuffer(value)
  : (value) => isObjectLike(value) && getTag(value) == '[object ArrayBuffer]';

export default isArrayBuffer;
