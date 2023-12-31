/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XFindLastIndex(f, xf) {
  this.xf = xf;
  this.f = f;
  this.idx = -1;
  this.lastIdx = -1;
}
XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;
XFindLastIndex.prototype['@@transducer/result'] = function(result) {
  return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
};
XFindLastIndex.prototype['@@transducer/step'] = function(result, input) {
  this.idx += 1;
  if (this.f(input)) {
    this.lastIdx = this.idx;
  }
  return result;
};

let _xfindLastIndex = _curry2(function _xfindLastIndex(f, xf) { return new XFindLastIndex(f, xf); });
export default _xfindLastIndex;
