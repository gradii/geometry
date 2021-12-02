/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _forceReduced(x) {
  return {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}
