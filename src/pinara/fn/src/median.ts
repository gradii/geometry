/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry1 from './internal/_curry1.js';
import mean from './mean.js';


/**
 * Returns the median of the given list of numbers.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list
 * @return {Number}
 * @see R.mean
 * @example
 *
 *      R.median([2, 9, 7]); //=> 7
 *      R.median([7, 2, 10, 9]); //=> 8
 *      R.median([]); //=> NaN
 */
let median = _curry1(function median(list) {
  let len = list.length;
  if (len === 0) {
    return NaN;
  }
  let width = 2 - len % 2;
  let idx = (len - width) / 2;
  return mean(Array.prototype.slice.call(list, 0).sort(function(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }).slice(idx, idx + width));
});
export default median;
