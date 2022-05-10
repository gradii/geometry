/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { upperFirst } from './upper-first';
import { toString } from './to-string';

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * capitalize('FRED')
 * // => 'Fred'
 */
const capitalize = (string) => upperFirst(toString(string).toLowerCase());


export default capitalize;
