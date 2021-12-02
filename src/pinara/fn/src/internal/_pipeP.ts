/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _pipeP(f, g) {
  return function() {
    let ctx = this;
    return f.apply(ctx, arguments).then(function(x) {
      return g.call(ctx, x);
    });
  };
}
