/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry1 from './internal/_curry1.js';


/**
 * Returns a list containing the names of all the properties of the supplied
 * object, including prototype properties.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own and prototype properties.
 * @see R.keys, R.valuesIn
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.keysIn(f); //=> ['x', 'y']
 */
let keysIn = _curry1(function keysIn(obj) {
  let prop;
  let ks = [];
  for (prop in obj) {
    ks[ks.length] = prop;
  }
  return ks;
});
export default keysIn;