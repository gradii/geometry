/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
let pad = function pad(n) { return (n < 10 ? '0' : '') + n; };

let _toISOString = typeof Date.prototype.toISOString === 'function' ?
  function _toISOString(d) {
    return d.toISOString();
  } :
  function _toISOString(d) {
    return (
      d.getUTCFullYear() + '-' +
      pad(d.getUTCMonth() + 1) + '-' +
      pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + ':' +
      pad(d.getUTCMinutes()) + ':' +
      pad(d.getUTCSeconds()) + '.' +
      (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z'
    );
  };

export default _toISOString;
