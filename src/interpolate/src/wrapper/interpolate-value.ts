/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Color, createColor } from '@gradii/color';
import { InterpolateArray } from '../interpolate/array';
import { InterpolateConstant } from '../interpolate/constant';
import { InterpolateDate } from '../interpolate/date';
import { InterpolateNumber } from '../interpolate/number';
import { InterpolateObject } from '../interpolate/object';
import { InterpolateRgb } from '../interpolate/rgb';
import { InterpolateString } from '../interpolate/string';

export function interpolateValue(a, b) {
  return (i) => {
    let t = typeof b, c;
    if (b == null || t === 'boolean') {
      return new InterpolateConstant(b).getResult(i);
    } else if (t === 'number') {
      return new InterpolateNumber().interpolate(+a, +b).getResult(i);
    } else if (t === 'string') {
      if (c = createColor(b)) {
        return new InterpolateRgb().interpolate(a, c).getResult(i);
      } else {
        return new InterpolateString().interpolate(a, b).getResult(i);
      }
    } else if (b instanceof Color) {
      return new InterpolateRgb().interpolate(a, b).getResult(i);
    } else if (b instanceof Date) {
      return new InterpolateDate().interpolate(a, b).getResult(i);
    } else if (Array.isArray(b)) {
      return new InterpolateArray().interpolate(a, b).getResult(i);
    } else if (typeof b.valueOf !== 'function' && typeof b.toString !== 'function' || isNaN(b)) {
      return new InterpolateObject().interpolate(a, b).getResult(i);
    } else {
      return new InterpolateNumber().interpolate(+a, +b).getResult(i);
    }
  };
}
