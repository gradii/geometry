/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry1 from './internal/_curry1.js';


/**
 * Negates its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number}
 * @example
 *
 *      R.negate(42); //=> -42
 */
let negate = _curry1(function negate(n) { return -n; });
export default negate;
