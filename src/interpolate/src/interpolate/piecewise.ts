/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export class InterpolatePiecewise {
  protected I;

  public values: any[];

  constructor(public interpolator: any) {
  }

  public interpolate(values: any[]): this {
    this.values = values;
    let i       = 0,
        n       = values.length - 1,
        v       = values[0];
    this.I      = new Array(n < 0 ? 0 : n);
    while (i < n) {
      this.I[i] = this.interpolator(v, v = values[++i]);
    }
    return this;
  }

  public getResult(t) {
    let n = this.values.length - 1;
    let i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return this.I[i](t - i);
  }
}
