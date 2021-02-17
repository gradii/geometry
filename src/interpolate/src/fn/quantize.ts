/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export function quantize(interpolator, n) {
  let samples = new Array(n);
  for (let i = 0; i < n; ++i) {
    samples[i] = interpolator(i / (n - 1));
  }
  return samples;
}

export function quantizeFactory(interpolateFactory, n) {
  let samples = new Array(n);
  for (let i = 0; i < n; ++i) {
    samples[i] = interpolateFactory.getResult(i / (n - 1));
  }
  return samples;
}
