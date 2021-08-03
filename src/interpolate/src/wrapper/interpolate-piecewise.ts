/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolatePiecewise } from '../interpolate/piecewise';

export function interpolatePiecewise(values, interpolate) {
  return t => {
    return new InterpolatePiecewise(interpolate).interpolate(values).getResult(t);
  };
}
