/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry1 from './internal/_curry1.js';


let ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
         '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
         '\u2029\uFEFF';
let zeroWidth = '\u200b';
let hasProtoTrim = (typeof String.prototype.trim === 'function');
/**
 * Removes (strips) whitespace from both ends of the string.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to trim.
 * @return {String} Trimmed version of `str`.
 * @example
 *
 *      R.trim('   xyz  '); //=> 'xyz'
 *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
 */
let trim = !hasProtoTrim || (ws.trim() || !zeroWidth.trim()) ?
  _curry1(function trim(str) {
    let beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
    let endRx = new RegExp('[' + ws + '][' + ws + ']*$');
    return str.replace(beginRx, '').replace(endRx, '');
  }) :
  _curry1(function trim(str) {
    return str.trim();
  });
export default trim;
