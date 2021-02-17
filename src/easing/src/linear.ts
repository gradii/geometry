/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

export class EasingLinear {
  public static easeIn    = new EasingLinear;
  public static easeOut   = EasingLinear.easeIn;
  public static easeInOut = EasingLinear.easeIn;

  public getRatio(p: number): number {
    return p;
  }
}
