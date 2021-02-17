/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export class InterpolateDate {
  public a;
  public b;

  public interpolate(a, b) {
    this.a = a;
    this.b = b;
    return this;
  }

  public getResult(t: number) {
    let d = new Date;
    d.setTime(+this.a + (this.b - this.a) * t);
    return d;
  }
}
