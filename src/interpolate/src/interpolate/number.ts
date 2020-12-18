/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

export class InterpolateNumber {
  public a: any;
  public b: any;

  public interpolate(a, b) {
    this.a = a;
    this.b = b;
    return this;
  }

  public getResult(t) {
    return this.a + (this.b - this.a) * t;
  }
}
