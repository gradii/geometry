/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry2 from './internal/_curry2.js';
import mergeDeepWithKey from './mergeDeepWithKey.js';


/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepLeft, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepRight({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                       { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 40, contact: { email: 'baa@example.com' }}
 */
let mergeDeepRight = _curry2(function mergeDeepRight(lObj, rObj) {
  return mergeDeepWithKey(function(k, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
});
export default mergeDeepRight;
