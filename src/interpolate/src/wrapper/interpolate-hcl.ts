/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateHcl, InterpolateHclLong } from '../interpolate/hcl';

export function interpolateHcl(start, end) {
  return t => {
    return new InterpolateHcl().interpolate(start, end).getResult(t);
  };
}

export function interpolateHclLong(start, end) {
  return t => {
    return new InterpolateHclLong().interpolate(start, end).getResult(t);
  };
}
