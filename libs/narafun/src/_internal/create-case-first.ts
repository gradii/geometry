/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { castSlice } from './cast-slice';
import { hasUnicode } from './has-unicode';
import { stringToArray } from './string-to-array';

/**
 * Creates a function like `lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
export function createCaseFirst(methodName) {
  return (string) => {
    if (!string) {
      return '';
    }

    const strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    const chr = strSymbols
      ? strSymbols[0]
      : string[0];

    const trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}


