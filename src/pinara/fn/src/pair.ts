/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry2 from './internal/_curry2.js';


/**
 * Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category List
 * @sig a -> b -> (a,b)
 * @param {*} fst
 * @param {*} snd
 * @return {Array}
 * @see R.objOf, R.of
 * @example
 *
 *      R.pair('foo', 'bar'); //=> ['foo', 'bar']
 */
let pair = _curry2(function pair(fst, snd) { return [fst, snd]; });
export default pair;
