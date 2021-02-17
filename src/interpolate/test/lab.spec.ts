/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { hsl, lab, rgb } from '@gradii/color';
import { interpolateLab } from '../public-api';

describe('test interpolate lab', () => {
  it('interpolateLab(a, b) converts a and b to Lab colors', () => {
    expect(interpolateLab('steelblue', 'brown')(0) + '').toBe(rgb('steelblue') + '');
    expect(interpolateLab('steelblue', hsl('brown'))(1) + '').toBe(rgb('brown') + '');
    expect(interpolateLab('steelblue', rgb('brown'))(1) + '').toBe(rgb('brown') + '');

  });

  it('interpolateLab(a, b) interpolates in Lab and returns an RGB string', () => {
    expect(interpolateLab('steelblue', '#f00')(0.2) + '').toBe('rgb(138, 119, 147)');
    expect(interpolateLab('rgba(70, 130, 180, 1)', 'rgba(255, 0, 0, 0.2)')(0.2) + '').toBe('rgba(138, 119, 147, 0.84)');

  });

  it('interpolateLab(a, b) uses b’s channel value when a’s channel value is undefined', () => {
    expect(interpolateLab(null, lab(20, 40, 60))(0.5) + '').toBe(lab(20, 40, 60) + '');
    expect(interpolateLab(lab(NaN, 20, 40), lab(60, 80, 100))(0.5) + '').toBe(lab(60, 50, 70) + '');
    expect(interpolateLab(lab(20, NaN, 40), lab(60, 80, 100))(0.5) + '').toBe(lab(40, 80, 70) + '');
    expect(interpolateLab(lab(20, 40, NaN), lab(60, 80, 100))(0.5) + '').toBe(lab(40, 60, 100) + '');

  });

  it('interpolateLab(a, b) uses a’s channel value when b’s channel value is undefined', () => {
    expect(interpolateLab(lab(20, 40, 60), null)(0.5) + '').toBe(lab(20, 40, 60) + '');
    expect(interpolateLab(lab(60, 80, 100), lab(NaN, 20, 40))(0.5) + '').toBe(lab(60, 50, 70) + '');
    expect(interpolateLab(lab(60, 80, 100), lab(20, NaN, 40))(0.5) + '').toBe(lab(40, 80, 70) + '');
    expect(interpolateLab(lab(60, 80, 100), lab(20, 40, NaN))(0.5) + '').toBe(lab(40, 60, 100) + '');

  });
});

