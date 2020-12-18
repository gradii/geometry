/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import { hcl, rgb } from '@gradii/color';
import { interpolateHcl } from '../public-api';

describe('test interpolate hcl', () => {

  it('interpolateHcl(a, b) converts a and b to HCL colors', () => {
    expect(interpolateHcl('steelblue', 'brown')(0) + '').toBe(rgb('steelblue') + '');
    expect(interpolateHcl('steelblue', hcl('brown'))(1) + '').toBe(rgb('brown') + '');
    expect(interpolateHcl('steelblue', rgb('brown'))(1) + '').toBe(rgb('brown') + '');
  });

  it('interpolateHcl(a, b) interpolates in HCL and returns an RGB string', () => {
    expect(interpolateHcl('steelblue', '#f00')(0.2) + '').toBe('rgb(0, 144, 174)');
    expect(interpolateHcl('rgba(70, 130, 180, 1)', 'rgba(255, 0, 0, 0.2)')(0.2) + '').toBe('rgba(0, 144, 174, 0.84)');
  });

  it('interpolateHcl(a, b) uses the negative path direction', () => {
    let i = interpolateHcl(hcl(10, 50, 50), hcl(-10, 50, 50));
    expect(i(0.0) + '').toBe('rgb(196, 79, 106)');
    expect(i(0.2) + '').toBe('rgb(196, 79, 112)');
    expect(i(0.4) + '').toBe('rgb(195, 79, 118)');
    expect(i(0.6) + '').toBe('rgb(193, 79, 124)');
    expect(i(0.8) + '').toBe('rgb(191, 80, 129)');
    expect(i(1.0) + '').toBe('rgb(189, 81, 135)');
  });

  it('interpolateHcl(a, b) uses the right path when interpolating hue difference greater than 360°', () => {
    let i = interpolateHcl(hcl(10, 50, 50), hcl(380, 50, 50));
    expect(i(0.0) + '').toBe('rgb(196, 79, 106)');
    expect(i(0.2) + '').toBe('rgb(196, 79, 104)');
    expect(i(0.4) + '').toBe('rgb(197, 80, 101)');
    expect(i(0.6) + '').toBe('rgb(196, 80, 98)');
    expect(i(0.8) + '').toBe('rgb(196, 80, 95)');
    expect(i(1.0) + '').toBe('rgb(196, 81, 92)');
  });

  it('interpolateHcl(a, b) uses the negative path direction', () => {
    let i = interpolateHcl(hcl(10, 50, 50), hcl(-370, 50, 50));
    expect(i(0.0) + '').toBe('rgb(196, 79, 106)');
    expect(i(0.2) + '').toBe('rgb(196, 79, 112)');
    expect(i(0.4) + '').toBe('rgb(195, 79, 118)');
    expect(i(0.6) + '').toBe('rgb(193, 79, 124)');
    expect(i(0.8) + '').toBe('rgb(191, 80, 129)');
    expect(i(1.0) + '').toBe('rgb(189, 81, 135)');
  });

  it('interpolateHcl(a, b) uses the right path when interpolating hue difference greater than 720°', () => {
    let i = interpolateHcl(hcl(10, 50, 50), hcl(740, 50, 50));
    expect(i(0.0) + '').toBe('rgb(196, 79, 106)');
    expect(i(0.2) + '').toBe('rgb(196, 79, 104)');
    expect(i(0.4) + '').toBe('rgb(197, 80, 101)');
    expect(i(0.6) + '').toBe('rgb(196, 80, 98)');
    expect(i(0.8) + '').toBe('rgb(196, 80, 95)');
    expect(i(1.0) + '').toBe('rgb(196, 81, 92)');
  });

  it('interpolateHcl(a, b) uses a’s hue when b’s hue is undefined', () => {
    expect(interpolateHcl('#f60', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(155, 0, 0)');
    expect(interpolateHcl('#6f0', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(0, 129, 0)');
  });

  it('interpolateHcl(a, b) uses b’s hue when a’s hue is undefined', () => {
    expect(interpolateHcl(hcl(NaN, NaN, 0), '#f60')(0.5) + '').toBe('rgb(155, 0, 0)');
    expect(interpolateHcl(hcl(NaN, NaN, 0), '#6f0')(0.5) + '').toBe('rgb(0, 129, 0)');
  });

  it('interpolateHcl(a, b) uses a’s chroma when b’s chroma is undefined', () => {
    expect(interpolateHcl('#ccc', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(97, 97, 97)');
    expect(interpolateHcl('#f00', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(166, 0, 0)');
  });

  it('interpolateHcl(a, b) uses b’s chroma when a’s chroma is undefined', () => {
    expect(interpolateHcl(hcl(NaN, NaN, 0), '#ccc')(0.5) + '').toBe('rgb(97, 97, 97)');
    expect(interpolateHcl(hcl(NaN, NaN, 0), '#f00')(0.5) + '').toBe('rgb(166, 0, 0)');
  });

  it('interpolateHcl(a, b) uses b’s luminance when a’s luminance is undefined', () => {
    expect(interpolateHcl(null, hcl(20, 80, 50))(0.5) + '').toBe('rgb(234, 19, 77)');
  });

  it('interpolateHcl(a, b) uses a’s luminance when b’s luminance is undefined', () => {
    expect(interpolateHcl(hcl(20, 80, 50), null)(0.5) + '').toBe('rgb(234, 19, 77)');
  });

});
