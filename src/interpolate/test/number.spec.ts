/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */
import { interpolateNumber } from '../public-api';


describe('test interpolate number', () => {
  it('interpolateNumber(a, b) interpolates between two numbers a and b', () => {
    let i = interpolateNumber(10, 42);
    expect(i(0.0)).toBeCloseTo(10.0);
    expect(i(0.1)).toBeCloseTo(13.2);
    expect(i(0.2)).toBeCloseTo(16.4);
    expect(i(0.3)).toBeCloseTo(19.6);
    expect(i(0.4)).toBeCloseTo(22.8);
    expect(i(0.5)).toBeCloseTo(26.0);
    expect(i(0.6)).toBeCloseTo(29.2);
    expect(i(0.7)).toBeCloseTo(32.4);
    expect(i(0.8)).toBeCloseTo(35.6);
    expect(i(0.9)).toBeCloseTo(38.8);
    expect(i(1.0)).toBeCloseTo(42.0);

  });
});

