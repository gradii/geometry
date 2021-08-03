/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateDate } from '../interpolate/date';

export function interpolateDate(start: number, end: number) {
  return (t: number) => {
    return new InterpolateDate().interpolate(start, end).getResult(t);
  };
}
