/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
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
