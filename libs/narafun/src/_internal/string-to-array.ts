/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { asciiToArray } from './ascii-to-array';
import { hasUnicode } from './has-unicode';
import { unicodeToArray } from './unicode-to-array';

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
export function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}


