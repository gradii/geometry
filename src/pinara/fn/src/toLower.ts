/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import invoker from './invoker.js';


/**
 * The lower case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to lower case.
 * @return {String} The lower case version of `str`.
 * @see R.toUpper
 * @example
 *
 *      R.toLower('XYZ'); //=> 'xyz'
 */
let toLower = invoker(0, 'toLowerCase');
export default toLower;
