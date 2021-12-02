/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry3 from './_curry3.js';
import _xfBase from './_xfBase.js';
import _promap from './_promap.js';


function XPromap(f, g, xf) {
  this.xf = xf;
  this.f = f;
  this.g = g;
}
XPromap.prototype['@@transducer/init'] = _xfBase.init;
XPromap.prototype['@@transducer/result'] = _xfBase.result;
XPromap.prototype['@@transducer/step'] = function(result, input) {
  return this.xf['@@transducer/step'](result, _promap(this.f, this.g, input));
};

let _xpromap = _curry3(function _xpromap(f, g, xf) { return new XPromap(f, g, xf); });
export default _xpromap;
