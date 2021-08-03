/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateConstant } from '../interpolate/constant';

export function interpolateConstant(x: any) {
  return (t: number) => {
    return new InterpolateConstant(x).getResult(t);
  };
}
