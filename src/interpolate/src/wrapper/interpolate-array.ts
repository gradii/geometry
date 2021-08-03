/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateArray } from '../interpolate/array';

const interpolator = new InterpolateArray();

export function interpolateArray(a: any[], b: any[]) {
  return (t: number) => {
    return interpolator.interpolate(a, b).getResult(t);
  };
}
