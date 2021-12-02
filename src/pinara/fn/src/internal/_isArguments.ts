/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _has from './_has.js';


let toString = Object.prototype.toString;
let _isArguments = (function() {
  return toString.call(arguments) === '[object Arguments]' ?
    function _isArguments(x) { return toString.call(x) === '[object Arguments]'; } :
    function _isArguments(x) { return _has('callee', x); };
}());

export default _isArguments;
