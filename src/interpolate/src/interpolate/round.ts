/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
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
