/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateString } from '../interpolate/string';

export function interpolateString(a, b) {
  return t => {
    return new InterpolateString().interpolate(a, b).getResult(t);
  };
}
