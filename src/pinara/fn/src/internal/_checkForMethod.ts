/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _isArray from './_isArray.js';


/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implementation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
export default function _checkForMethod(methodname, fn) {
  return function() {
    let length = arguments.length;
    if (length === 0) {
      return fn();
    }
    let obj = arguments[length - 1];
    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
      fn.apply(this, arguments) :
      obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}
