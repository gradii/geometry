/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry2 from './_curry2.js';
import _flatCat from './_flatCat.js';
import map from '../map.js';


let _xchain = _curry2(function _xchain(f, xf) {
  return map(f, _flatCat(xf));
});
export default _xchain;
