/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}
