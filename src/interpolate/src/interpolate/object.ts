/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import { interpolateValue } from '../wrapper/interpolate-value';

export class InterpolateObject {
  public c: any                         = {};
  public i: { [key: string]: Function } = {};

  public interpolate(a, b) {
    if (a === null || typeof a !== 'object') {
      a = {};
    }
    if (b === null || typeof b !== 'object') {
      b = {};
    }

    for (let k in b) {
      if (k in a) {
        this.i[k] = interpolateValue(a[k], b[k]);
      } else {
        this.c[k] = b[k];
      }
    }
    return this;
  }

  public getResult(t) {
    for (let [key, val] of Object.entries(this.i)) {
      this.c[key] = val(t);
    }
    
    return this.c;
  }
}
