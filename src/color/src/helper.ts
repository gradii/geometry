/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  named,
  reHex3,
  reHex6,
  reHslaPercent,
  reHslPercent,
  reRgbaInteger,
  reRgbaPercent,
  reRgbInteger,
  reRgbPercent
} from './const';
import { hsla } from './hsl';
import { Rgb, rgba, rgbn } from './rgb';

export function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return value.toString(16).padStart(2, '0');
}

export function create(format: string) {
  let m: any;
  format = (`${format}`).trim().toLowerCase();
  if (m = reHex3.exec(format)) {
    m = parseInt(m[1], 16);
    return new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1);
  } else if (m = reHex6.exec(format)) {
    return rgbn(parseInt(m[1], 16));
  } else if (m = reRgbInteger.exec(format)) {
    return new Rgb(m[1], m[2], m[3], 1);
  } else if (m = reRgbPercent.exec(format)) {
    return new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1);
  } else if (m = reRgbaInteger.exec(format)) {
    return rgba(m[1], m[2], m[3], m[4]);
  } else if (m = reRgbaPercent.exec(format)) {
    return rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]);
  } else if (m = reHslPercent.exec(format)) {
    return hsla(+m[1], m[2] / 100, m[3] / 100, 1);
  } else if (m = reHslaPercent.exec(format)) {
    return hsla(+m[1], m[2] / 100, m[3] / 100, +m[4]);
  } else if (named.hasOwnProperty(format)) {
    return rgbn(named[format]);
  } else if (format === 'transparent') {
    return new Rgb(NaN, NaN, NaN, 0);
  }
  return null;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
