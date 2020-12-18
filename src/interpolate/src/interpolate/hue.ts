/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import { InterpolateLinear } from './linear';

export class InterpolateHue {
  public a;
  public b;

  public interpolate(a, b) {
    this.a = a % 360;
    this.b = b % 360;
    return this;
  }

  public getResult(t) {
    if (this.b - this.a) {
      return new InterpolateLinear()
        .interpolate(this.a, this.b)
        .getResult(t);
    } else {
      return isNaN(this.a) ? this.b : this.a;
    }
  }
}
