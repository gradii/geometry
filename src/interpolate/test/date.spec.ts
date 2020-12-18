/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */
import { interpolateDate } from '../public-api';

function strictDateEqual(d1, d2) {
  expect(d1.getTime()).toBe(d2.getTime());
}

describe('test interpolate date', () => {
  it('interpolateDate(a, b) interpolates between two dates a and b', () => {
    let i = interpolateDate(new Date(2000, 0, 1), new Date(2000, 0, 2));
    expect(i(0.0) instanceof Date).toBe(true);
    expect(i(0.5) instanceof Date).toBe(true);
    expect(i(1.0) instanceof Date).toBe(true);
    expect(+i(0.2)).toBe(+new Date(2000, 0, 1, 4, 48));
    expect(+i(0.4)).toBe(+new Date(2000, 0, 1, 9, 36));
  });

  // it('interpolateDate(a, b) reuses the output datea', () => {
  //   let i = interpolateDate(new Date(2000, 0, 1), new Date(2000, 0, 2));
  //   strictDateEqual(i(0.2), i(0.4));
  // });

});
