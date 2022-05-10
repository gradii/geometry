/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { createCaseFirst } from './_internal/create-case-first';

/**
 * Converts the first character of `string` to lower case.
 *
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * lowerFirst('Fred')
 * // => 'fred'
 *
 * lowerFirst('FRED')
 * // => 'fRED'
 */
export const lowerFirst = createCaseFirst('toLowerCase');
