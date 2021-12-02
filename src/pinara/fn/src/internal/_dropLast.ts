/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import take from '../take.js';

export default function dropLast(n, xs) {
  return take(n < xs.length ? xs.length - n : 0, xs);
}
