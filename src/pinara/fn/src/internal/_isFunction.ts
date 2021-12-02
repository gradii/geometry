/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _isFunction(x) {
  let type = Object.prototype.toString.call(x);
  return type  === '[object Function]' ||
    type === '[object AsyncFunction]' ||
    type === '[object GeneratorFunction]' ||
    type === '[object AsyncGeneratorFunction]';
}
