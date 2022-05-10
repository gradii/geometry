/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { words } from './words';
import { toString } from './to-string';

const reQuotes = /['\u2019]/g;

/**
 * Converts `string`, as space separated words, to lower case.
 *
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @see camelCase, kebabCase, snakeCase, startCase, upperCase, upperFirst
 * @example
 *
 * lowerCase('--Foo-Bar--')
 * // => 'foo bar'
 *
 * lowerCase('fooBar')
 * // => 'foo bar'
 *
 * lowerCase('__FOO_BAR__')
 * // => 'foo bar'
 */
export const lowerCase = (string) => (
  words(toString(string).replace(reQuotes, '')).reduce((result, word, index) => (
    result + (index ? ' ' : '') + word.toLowerCase()
  ), '')
);
