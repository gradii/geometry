/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * Determine if the passed argument is an integer.
 *
 * @private
 * @param {*} n
 * @category Type
 * @return {Boolean}
 */
export default Number.isInteger || function _isInteger(n) {
  return (n << 0) === n;
};
