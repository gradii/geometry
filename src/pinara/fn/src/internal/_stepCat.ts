/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _objectAssign from './_objectAssign.js';
import _identity from './_identity.js';
import _isArrayLike from './_isArrayLike.js';
import _isTransformer from './_isTransformer.js';
import objOf from '../objOf.js';


let _stepCatArray = {
  '@@transducer/init': Array,
  '@@transducer/step': function(xs, x) {
    xs.push(x);
    return xs;
  },
  '@@transducer/result': _identity
};
let _stepCatString = {
  '@@transducer/init': String,
  '@@transducer/step': function(a, b) { return a + b; },
  '@@transducer/result': _identity
};
let _stepCatObject = {
  '@@transducer/init': Object,
  '@@transducer/step': function(result, input) {
    return _objectAssign(
      result,
      _isArrayLike(input) ? objOf(input[0], input[1]) : input
    );
  },
  '@@transducer/result': _identity
};

export default function _stepCat(obj) {
  if (_isTransformer(obj)) {
    return obj;
  }
  if (_isArrayLike(obj)) {
    return _stepCatArray;
  }
  if (typeof obj === 'string') {
    return _stepCatString;
  }
  if (typeof obj === 'object') {
    return _stepCatObject;
  }
  throw new Error('Cannot create transformer for ' + obj);
}
