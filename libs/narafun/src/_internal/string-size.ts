/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { _asciiSize } from './ascii-size';
import { hasUnicode } from './has-unicode';
import { unicodeSize } from './unicode-size';

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
export function stringSize(string) {
  return hasUnicode(string) ? unicodeSize(string) : _asciiSize(string);
}


