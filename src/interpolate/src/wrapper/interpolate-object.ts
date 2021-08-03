/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateObject } from '../interpolate/object';

export function interpolateObject(start, end) {
  return t => {
    return new InterpolateObject().interpolate(start, end).getResult(t);
  };
}
