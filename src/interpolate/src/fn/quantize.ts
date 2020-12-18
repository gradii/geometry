/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
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
