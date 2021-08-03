/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateHsl, InterpolateHslLong } from '../interpolate/hsl';

export function interpolateHsl(start, end) {
  return t => {
    return new InterpolateHsl().interpolate(start, end).getResult(t);
  };
}

export function interpolateHslLong(start, end) {
  return t => {
    return new InterpolateHslLong().interpolate(start, end).getResult(t);
  };
}
