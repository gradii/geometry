/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export class InterpolateRound {
  public a;
  public b;

  public interpolate(a, b): this {
    this.a = a;
    this.b = b;
    return this;
  }

  public getResult(t) {
    return Math.round(this.a + (this.b - this.a) * t);
  }
}
