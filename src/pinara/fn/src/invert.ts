/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry1 from './internal/_curry1.js';
import _has from './internal/_has.js';
import keys from './keys.js';


/**
 * Same as [`R.invertObj`](#invertObj), however this accounts for objects with
 * duplicate values by putting the values into an array.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {s: x} -> {x: [ s, ... ]}
 * @param {Object} obj The object or array to invert
 * @return {Object} out A new object with keys in an array.
 * @see R.invertObj
 * @example
 *
 *      const raceResultsByFirstName = {
 *        first: 'alice',
 *        second: 'jake',
 *        third: 'alice',
 *      };
 *      R.invert(raceResultsByFirstName);
 *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
 */
let invert = _curry1(function invert(obj) {
  let props = keys(obj);
  let len = props.length;
  let idx = 0;
  let out = {};

  while (idx < len) {
    let key = props[idx];
    let val = obj[key];
    let list = _has(val, out) ? out[val] : (out[val] = []);
    list[list.length] = key;
    idx += 1;
  }
  return out;
});
export default invert;
