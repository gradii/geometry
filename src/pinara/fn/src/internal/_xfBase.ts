/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default {
  init: function() {
    return this.xf['@@transducer/init']();
  },
  result: function(result) {
    return this.xf['@@transducer/result'](result);
  }
};
