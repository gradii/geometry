/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateDate } from '../interpolate/date';

export function interpolateDate(start, end) {
  return t => {
    return new InterpolateDate().interpolate(start, end).getResult(t);
  };
}
