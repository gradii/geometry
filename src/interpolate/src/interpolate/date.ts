/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
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
