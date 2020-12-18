/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

export class InterpolateLinear {
  public a;
  public b;

  public interpolate(a, b) {
    this.a = a;
    this.b = b;
    return this;
  }

  public getResult(t) {
    return this.a + t * (this.b - this.a);
  }
}
