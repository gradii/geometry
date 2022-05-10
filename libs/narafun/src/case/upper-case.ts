/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { words } from './words';
import { toString } from './to-string';

/**
 * Converts `string`, as space separated words, to upper case.
 *
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the upper cased string.
 * @see camelCase, kebabCase, lowerCase, snakeCase, startCase, upperFirst
 * @example
 *
 * upperCase('--foo-bar')
 * // => 'FOO BAR'
 *
 * upperCase('fooBar')
 * // => 'FOO BAR'
 *
 * upperCase('__foo_bar__')
 * // => 'FOO BAR'
 */
const upperCase = (string) => (
  words(toString(string).replace(/['\u2019]/g, '')).reduce((result, word, index) => (
    result + (index ? ' ' : '') + word.toUpperCase()
  ), '')
);

export default upperCase;
