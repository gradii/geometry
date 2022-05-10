/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { createCaseFirst } from './_internal/create-case-first';

/**
 * Converts the first character of `string` to upper case.
 *
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @see camelCase, kebabCase, lowerCase, snakeCase, startCase, upperCase
 * @example
 *
 * upperFirst('fred')
 * // => 'Fred'
 *
 * upperFirst('FRED')
 * // => 'FRED'
 */
const upperFirst = createCaseFirst('toUpperCase');

export default upperFirst;
