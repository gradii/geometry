/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

export class InterpolateExponential {
  public a;
  public b;

  constructor(public y) {
  }

  public interpolate(a, b) {
    this.a = a;
    this.b = b;
    return this;
  }

  public getResult(t) {
    const a = Math.pow(this.a, this.y);
    const b = Math.pow(this.b, this.y);
    return Math.pow(a + t * (b - a), 1 / this.y);
  }
}
