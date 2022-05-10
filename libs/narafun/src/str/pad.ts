/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { createPadding } from './_internal/create-padding';
import { stringSize } from './_internal/string-size';

/**
 * Pads `string` on the left and right sides if it's shorter than `length`.
 * Padding characters are truncated if they can't be evenly divided by `length`.
 *
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * pad('abc', 8)
 * // => '  abc   '
 *
 * pad('abc', 8, '_-')
 * // => '_-abc_-_'
 *
 * pad('abc', 2)
 * // => 'abc'
 */
export function pad(string, length, chars) {
  const strLength = length ? stringSize(string) : 0;
  if (!length || strLength >= length) {
    return (string || '');
  }
  const mid = (length - strLength) / 2;
  return (
    createPadding(Math.floor(mid), chars) +
    string +
    createPadding(Math.ceil(mid), chars)
  );
}


