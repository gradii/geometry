/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { hcl, rgb } from '@gradii/color';
import { interpolateHclLong } from '../public-api';

describe('test interpolate hcl long', () => {

  it('interpolateHclLong(a, b) converts a and b to HCL colors', () => {
    expect(interpolateHclLong('steelblue', 'brown')(0) + '').toBe(rgb('steelblue') + '');
    expect(interpolateHclLong('steelblue', hcl('brown'))(1) + '').toBe(rgb('brown') + '');
    expect(interpolateHclLong('steelblue', rgb('brown'))(1) + '').toBe(rgb('brown') + '');

  });

  it('interpolateHclLong(a, b) interpolates in HCL and returns an RGB string', () => {
    expect(interpolateHclLong('steelblue', '#f00')(0.2) + '').toBe('rgb(0, 144, 174)');
    expect(interpolateHclLong('rgba(70, 130, 180, 1)', 'rgba(255, 0, 0, 0.2)')(0.2) + '').toBe('rgba(0, 144, 174, 0.84)');

  });

  it('interpolateHclLong(a, b) does not use the shortest path when interpolating hue', () => {
    let i = interpolateHclLong(hcl(10, 50, 50), hcl(350, 50, 50));
    expect(i(0.0) + '').toBe('rgb(196, 79, 106)');
    expect(i(0.2) + '').toBe('rgb(156, 111, 29)');
    expect(i(0.4) + '').toBe('rgb(46, 135, 69)');
    expect(i(0.6) + '').toBe('rgb(0, 138, 165)');
    expect(i(0.8) + '').toBe('rgb(67, 118, 202)');
    expect(i(1.0) + '').toBe('rgb(189, 81, 135)');

  });

  it('interpolateHclLong(a, b) uses a’s hue when b’s hue is undefined', () => {
    expect(interpolateHclLong('#f60', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(155, 0, 0)');
    expect(interpolateHclLong('#6f0', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(0, 129, 0)');

  });

  it('interpolateHclLong(a, b) uses b’s hue when a’s hue is undefined', () => {
    expect(interpolateHclLong(hcl(NaN, NaN, 0), '#f60')(0.5) + '').toBe('rgb(155, 0, 0)');
    expect(interpolateHclLong(hcl(NaN, NaN, 0), '#6f0')(0.5) + '').toBe('rgb(0, 129, 0)');

  });

  it('interpolateHclLong(a, b) uses a’s chroma when b’s chroma is undefined', () => {
    expect(interpolateHclLong('#ccc', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(97, 97, 97)');
    expect(interpolateHclLong('#f00', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(166, 0, 0)');

  });

  it('interpolateHclLong(a, b) uses b’s chroma when a’s chroma is undefined', () => {
    expect(interpolateHclLong(hcl(NaN, NaN, 0), '#ccc')(0.5) + '').toBe('rgb(97, 97, 97)');
    expect(interpolateHclLong(hcl(NaN, NaN, 0), '#f00')(0.5) + '').toBe('rgb(166, 0, 0)');

  });

  it('interpolateHclLong(a, b) uses b’s luminance when a’s luminance is undefined', () => {
    expect(interpolateHclLong(null, hcl(20, 80, 50))(0.5) + '').toBe('rgb(234, 19, 77)');

  });

  it('interpolateHclLong(a, b) uses a’s luminance when b’s luminance is undefined', () => {
    expect(interpolateHclLong(hcl(20, 80, 50), null)(0.5) + '').toBe('rgb(234, 19, 77)');

  });

});
