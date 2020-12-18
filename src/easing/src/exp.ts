/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * @private
 */
export class ExpIn {

  public getRatio(p: number): number {
    return p === 0.0 ? p : Math.pow(2.0, 10.0 * (p - 1.0));
  }
}

/**
 * @private
 */
export class ExpOut {

  public getRatio(p: number): number {
    return p === 1.0 ? 1 : 1 - Math.pow(2, -10 * p);
  }
}

/**
 * @private
 */
export class ExpInOut {

  public getRatio(p: number): number {
    return (p === 0.0 || p === 1.0)
      ? p
      : ((p *= 2) < 1)
        ? 0.5 * Math.pow(2, 10 * (p - 1))
        : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
  }
}

export class EasingExp {
  public static easeIn: ExpIn = new ExpIn();
  public static easeOut: ExpOut = new ExpOut();
  public static easeInOut: ExpInOut = new ExpInOut();
}
