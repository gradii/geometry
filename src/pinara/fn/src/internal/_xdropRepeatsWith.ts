/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XDropRepeatsWith(pred, xf) {
  this.xf = xf;
  this.pred = pred;
  this.lastValue = undefined;
  this.seenFirstValue = false;
}

XDropRepeatsWith.prototype['@@transducer/init'] = _xfBase.init;
XDropRepeatsWith.prototype['@@transducer/result'] = _xfBase.result;
XDropRepeatsWith.prototype['@@transducer/step'] = function(result, input) {
  let sameAsLast = false;
  if (!this.seenFirstValue) {
    this.seenFirstValue = true;
  } else if (this.pred(this.lastValue, input)) {
    sameAsLast = true;
  }
  this.lastValue = input;
  return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
};

let _xdropRepeatsWith = _curry2(function _xdropRepeatsWith(pred, xf) { return new XDropRepeatsWith(pred, xf); });
export default _xdropRepeatsWith;
