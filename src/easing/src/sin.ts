/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const _HALF_PI = Math.PI / 2;

/**
 * @private
 */
export class SinIn {

  public getRatio(p: number): number {
    return -Math.cos(p * _HALF_PI) + 1;
  }
}

/**
 * @private
 */
export class SinOut {

  public getRatio(p: number): number {
    return Math.sin(p * _HALF_PI);
  }
}

/**
 * @private
 */
export class SinInOut {

  public getRatio(p: number): number {
    return -0.5 * (Math.cos(Math.PI * p) - 1);
  }
}

export class EasingSin {
  public static easeIn: SinIn       = new SinIn();
  public static easeOut: SinOut     = new SinOut();
  public static easeInOut: SinInOut = new SinInOut();
}
