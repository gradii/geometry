/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateRgb, InterpolateRgbBSpline, InterpolateRgbBSplineClosed } from '../interpolate/rgb';

export function interpolateRgb(start, end, gamma?) {
  return t => {
    return new InterpolateRgb(gamma).interpolate(start, end).getResult(t);
  };
}

export function interpolateRgbFactory(gamma?) {
  return (start, end) => {
    return t => {
      return new InterpolateRgb(gamma).interpolate(start, end).getResult(t);
    };
  };
}

export function interpolateRgbBSpline(colors) {
  return t => {
    return new InterpolateRgbBSpline().interpolate(colors).getResult(t);
  };
}

export function interpolateRgbBSplineClosed(colors) {
  return t => {
    return new InterpolateRgbBSplineClosed().interpolate(colors).getResult(t);
  };
}
