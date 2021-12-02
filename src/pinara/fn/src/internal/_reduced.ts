/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _reduced(x) {
  return x && x['@@transducer/reduced'] ? x :
    {
      '@@transducer/value': x,
      '@@transducer/reduced': true
    };
}
