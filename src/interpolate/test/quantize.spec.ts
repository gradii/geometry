/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */
import { interpolateNumber, interpolateRgb, quantize } from '../public-api';

describe('test interpolate quantize', () => {
  it('quantize(interpolate, n) returns n uniformly-spaced samples from the specified interpolator', () => {
    expect(quantize(interpolateNumber(0, 1), 5)).toEqual([
      0 / 4,
      1 / 4,
      2 / 4,
      3 / 4,
      4 / 4]);

    expect(quantize(interpolateRgb('steelblue', 'brown'), 5).map(_ => `${_}`)).toEqual([
      'rgb(70, 130, 180)',
      'rgb(94, 108, 146)',
      'rgb(118, 86, 111)',
      'rgb(141, 64, 77)',
      'rgb(165, 42, 42)']);
  });
});

