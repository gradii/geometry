/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _has from './_has.js';

// Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function _objectAssign(target) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  let output = Object(target);
  let idx = 1;
  let length = arguments.length;
  while (idx < length) {
    let source = arguments[idx];
    if (source != null) {
      for (let nextKey in source) {
        if (_has(nextKey, source)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
    idx += 1;
  }
  return output;
}

export default typeof Object.assign === 'function' ? Object.assign : _objectAssign;
