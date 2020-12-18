/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
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
