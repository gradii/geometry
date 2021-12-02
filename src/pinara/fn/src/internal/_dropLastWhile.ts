/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import slice from '../slice.js';

export default function dropLastWhile(pred, xs) {
  let idx = xs.length - 1;
  while (idx >= 0 && pred(xs[idx])) {
    idx -= 1;
  }
  return slice(0, idx + 1, xs);
}
