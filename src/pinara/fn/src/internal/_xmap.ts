/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XMap(f, xf) {
  this.xf = xf;
  this.f = f;
}
XMap.prototype['@@transducer/init'] = _xfBase.init;
XMap.prototype['@@transducer/result'] = _xfBase.result;
XMap.prototype['@@transducer/step'] = function(result, input) {
  return this.xf['@@transducer/step'](result, this.f(input));
};

let _xmap = _curry2(function _xmap(f, xf) { return new XMap(f, xf); });
export default _xmap;
