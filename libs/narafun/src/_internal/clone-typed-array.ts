/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { cloneArrayBuffer } from './clone-array-buffer';

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
export function cloneTypedArray(typedArray, isDeep) {
  const buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}


