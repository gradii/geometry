/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { interpolateRound } from '../public-api';

describe('test interpolate round', () => {
  it('interpolateRound(a, b) interpolates between two numbers a and b, and then rounds', () => {
    let i = interpolateRound(10, 42);
    expect(i(0.0)).toEqual(10);
    expect(i(0.1)).toEqual(13);
    expect(i(0.2)).toEqual(16);
    expect(i(0.3)).toEqual(20);
    expect(i(0.4)).toEqual(23);
    expect(i(0.5)).toEqual(26);
    expect(i(0.6)).toEqual(29);
    expect(i(0.7)).toEqual(32);
    expect(i(0.8)).toEqual(36);
    expect(i(0.9)).toEqual(39);
    expect(i(1.0)).toEqual(42);
  });

  it('interpolateRound(a, b) does not pre-round a and b', () => {
    let i = interpolateRound(2.6, 3.6);
    expect(i(0.6)).toEqual(3);
  });

});
