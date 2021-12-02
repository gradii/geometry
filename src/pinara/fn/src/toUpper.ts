/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import invoker from './invoker.js';


/**
 * The upper case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to upper case.
 * @return {String} The upper case version of `str`.
 * @see R.toLower
 * @example
 *
 *      R.toUpper('abc'); //=> 'ABC'
 */
let toUpper = invoker(0, 'toUpperCase');
export default toUpper;
