/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _forceReduced from './_forceReduced.js';
import _isArrayLike from './_isArrayLike.js';
import _reduce from './_reduce.js';
import _xfBase from './_xfBase.js';

let preservingReduced = function(xf) {
  return {
    '@@transducer/init': _xfBase.init,
    '@@transducer/result': function(result) {
      return xf['@@transducer/result'](result);
    },
    '@@transducer/step': function(result, input) {
      let ret = xf['@@transducer/step'](result, input);
      return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
    }
  };
};

let _flatCat = function _xcat(xf) {
  let rxf = preservingReduced(xf);
  return {
    '@@transducer/init': _xfBase.init,
    '@@transducer/result': function(result) {
      return rxf['@@transducer/result'](result);
    },
    '@@transducer/step': function(result, input) {
      return !_isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
    }
  };
};

export default _flatCat;
