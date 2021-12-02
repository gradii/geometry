/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _indexOf from './_indexOf.js';


export default function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}
