/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import add from './add.js';


/**
 * Decrements its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number} n - 1
 * @see R.inc
 * @example
 *
 *      R.dec(42); //=> 41
 */
let dec = add(-1);
export default dec;
