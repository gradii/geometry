/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

let degrees = 180 / Math.PI;

export let identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1,
};

/**
 * @deprecated use matrix3 instead
 * @param a
 * @param b
 * @param c
 * @param d
 * @param e
 * @param f
 */
export function decompose(a, b, c, d, e, f) {
  let scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) { a /= scaleX, b /= scaleX; }
  if (skewX = a * c + b * d) { c -= a * skewX, d -= b * skewX; }
  if (scaleY = Math.sqrt(c * c + d * d)) { c /= scaleY, d /= scaleY, skewX /= scaleY; }
  if (a * d < b * c) { a = -a, b = -b, skewX = -skewX, scaleX = -scaleX; }
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX,
    scaleY,
  };
}
