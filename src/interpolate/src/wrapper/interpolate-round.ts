/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateRound } from '../interpolate/round';

export function interpolateRound(a, b) {
  return t => {
    return new InterpolateRound().interpolate(a, b).getResult(t);
  };
}
