/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XTap(f, xf) {
  this.xf = xf;
  this.f = f;
}
XTap.prototype['@@transducer/init'] = _xfBase.init;
XTap.prototype['@@transducer/result'] = _xfBase.result;
XTap.prototype['@@transducer/step'] = function(result, input) {
  this.f(input);
  return this.xf['@@transducer/step'](result, input);
};

let _xtap = _curry2(function _xtap(f, xf) { return new XTap(f, xf); });
export default _xtap;
