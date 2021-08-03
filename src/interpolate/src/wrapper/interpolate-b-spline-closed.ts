/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateBSplineClosed } from '../interpolate/b-spline-closed';

const interpolator = new InterpolateBSplineClosed();

export function interpolateBSplineClosed(values) {
  return (t: number) => {
    return interpolator.interpolate(values).getResult(t);
  };
}
