/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateLab } from '../interpolate/lab';

export function interpolateLab(start, end) {
  return (t: number) => {
    return new InterpolateLab().interpolate(start, end).getResult(t);
  };
}
