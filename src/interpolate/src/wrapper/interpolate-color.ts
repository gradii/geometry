/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateColor } from '../interpolate/color';

const interpolator = new InterpolateColor();

export function interpolateColor(a: number, b: number) {
  return (t: number) => {
    return interpolator.interpolate(a, b).getResult(t);
  };
}
