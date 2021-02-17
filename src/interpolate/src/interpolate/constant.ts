/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export class InterpolateConstant {
  constructor(public x?: any) {
  }

  public interpolate(x) {
    this.x = x;
    return this;
  }

  public getResult(t: number) {
    return this.x;
  }
}
