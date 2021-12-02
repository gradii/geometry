/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry3 from './internal/_curry3.js';
import equals from './equals.js';


/**
 * Takes a function and two values in its domain and returns `true` if the
 * values map to the same value in the codomain; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Relation
 * @sig (a -> b) -> a -> a -> Boolean
 * @param {Function} f
 * @param {*} x
 * @param {*} y
 * @return {Boolean}
 * @example
 *
 *      R.eqBy(Math.abs, 5, -5); //=> true
 */
let eqBy = _curry3(function eqBy(f, x, y) {
  return equals(f(x), f(y));
});
export default eqBy;
