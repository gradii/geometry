/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { bSpline } from './helper';

export class InterpolateBSpline {
  public values;

  public interpolate(values) {
    this.values = values;
    return this;
  }

  public getResult(t) {
    const values = this.values;
    const n      = values.length - 1;
    let i        = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return bSpline((t - i / n) * n, v0, v1, v2, v3);
  }
}
