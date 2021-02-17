/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateExponential } from './exponential';
import { InterpolateLinear } from './linear';

export class InterpolateColor {
  public a;
  public b;

  constructor(public gamma: number = 1) {
  }

  public interpolate(a, b) {
    this.a = a;
    this.b = b;
    return this;
  }

  public getResult(t) {
    if (this.gamma === 1) {
      if (this.b - this.a) {
        return new InterpolateLinear()
          .interpolate(this.a, this.b)
          .getResult(t);
      } else {
        return isNaN(this.a) ? this.b : this.a;
      }
    } else {
      if (this.b - this.a) {
        return new InterpolateExponential(this.gamma)
          .interpolate(this.a, this.b)
          .getResult(t);
      } else {
        return isNaN(this.a) ? this.b : this.a;
      }
    }
  }
}
