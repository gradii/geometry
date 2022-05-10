/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { repeat } from '../repeat';
import { baseToString } from './base-to-string';
import { castSlice } from './cast-slice';
import { hasUnicode } from './has-unicode';
import { stringSize } from './string-size';
import { stringToArray } from './string-to-array';

/**
 * Creates the padding for `string` based on `length`. The `chars` string
 * is truncated if the number of characters exceeds `length`.
 *
 * @private
 * @param {number} length The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padding for `string`.
 */
export function createPadding(length, chars) {
  chars = chars === undefined ? ' ' : baseToString(chars);

  const charsLength = chars.length;
  if (charsLength < 2) {
    return charsLength ? repeat(chars, length) : chars;
  }
  const result = repeat(chars, Math.ceil(length / stringSize(chars)));
  return hasUnicode(chars)
    ? castSlice(stringToArray(result), 0, length).join('')
    : result.slice(0, length);
}


