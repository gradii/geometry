/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


export const EPSILON = 0.000001;

const degree = Math.PI / 180;

/**
 * 获取弧度对应的角度
 * @param  radian 弧度
 * @return  角度
 */
export function toDegree(radian) {
  return radian / degree;
}

/**
 * 广义取模运算
 * @param  n 被取模的值
 * @param  m 模
 * @return  返回n 被 m 取模的结果
 */
export function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Convert Degree To Radian
 *
 * @param  a Angle in Degrees
 */
export function toRadian(a: number) {
  return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param  a The first number to test.
 * @param  b The second number to test.
 * @returns   True if the numbers are approximately equal, false otherwise.
 */
export function equals(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

/**
 */
export function clamp(value, min, max) {
  return min < max
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value);
}
