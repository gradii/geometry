/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateBSpline } from '../interpolate/b-spline';

const interpolator = new InterpolateBSpline();

export function interpolateBSpline(values) {
  return (t: number) => {
    return interpolator.interpolate(values).getResult(t);
  };
}
