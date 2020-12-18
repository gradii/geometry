/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */
import { cubehelix, hcl, rgb } from '@gradii/color';
import { interpolateCubehelixLong, interpolateCubehelixLongFactory } from '../public-api';

describe('test interpolate cubehelix long', () => {

  it('interpolateCubehelixLong(a, b) converts a and b to Cubehelix colors', () => {
    expect(interpolateCubehelixLong('steelblue', 'brown')(0) + '').toBe(rgb('steelblue') + '');
    expect(interpolateCubehelixLong('steelblue', hcl('brown'))(1) + '').toBe(rgb('brown') + '');
    expect(interpolateCubehelixLong('steelblue', rgb('brown'))(1) + '').toBe(rgb('brown') + '');
  });

  it('interpolateCubehelixLong(a, b) interpolates in Cubehelix and returns an RGB string', () => {
    expect(interpolateCubehelixLong('steelblue', '#f00')(0.2) + '').toBe('rgb(88, 100, 218)');
    expect(interpolateCubehelixLong('rgba(70, 130, 180, 1)', 'rgba(255, 0, 0, 0.2)')(0.2) + '').toBe('rgba(88, 100, 218, 0.84)');
  });

  it('interpolateCubehelixLongFactory(3)(a, b) returns the expected values', () => {
    expect(interpolateCubehelixLongFactory(3)('steelblue', '#f00')(0.2) + '').toEqual('rgb(96, 107, 228)');
  });

  // it('interpolateCubehelixLong.gamma(g) coerces the specified gamma to a number', () => {
  //   expect(interpolateCubehelixLongFactory({valueOf() {return 3;}})('steelblue', '#f00')(0.2)+'').toBe('rgb(96, 107, 228)');
  // });

  it('interpolateCubehelixLong(a, b) is equivalent to interpolateCubehelixLong.gamma(1)(a, b)', () => {
    let i0 = interpolateCubehelixLongFactory(1)('purple', 'orange'),
        i1 = interpolateCubehelixLong('purple', 'orange');
    expect(i1(0.0).toString()).toBe(i0(0.0).toString());
    expect(i1(0.2).toString()).toBe(i0(0.2).toString());
    expect(i1(0.4).toString()).toBe(i0(0.4).toString());
    expect(i1(0.6).toString()).toBe(i0(0.6).toString());
    expect(i1(0.8).toString()).toBe(i0(0.8).toString());
    expect(i1(1.0).toString()).toBe(i0(1.0).toString());
  });

  it('interpolateCubehelixLong(a, b) uses the longest path when interpolating hue difference greater than 180°', () => {
    let i = interpolateCubehelixLong('purple', 'orange');
    expect(i(0.0) + '').toBe('rgb(128, 0, 128)');
    expect(i(0.2) + '').toBe('rgb(63, 54, 234)');
    expect(i(0.4) + '').toBe('rgb(0, 151, 217)');
    expect(i(0.6) + '').toBe('rgb(0, 223, 83)');
    expect(i(0.8) + '').toBe('rgb(79, 219, 0)');
    expect(i(1.0) + '').toBe('rgb(255, 165, 0)');
  });

  it('interpolateCubehelixLong(a, b) uses a’s hue when b’s hue is undefined', () => {
    expect(interpolateCubehelixLong('#f60', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(162, 41, 0)');
    expect(interpolateCubehelixLong('#6f0', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(3, 173, 0)');
  });

  it('interpolateCubehelixLong(a, b) uses b’s hue when a’s hue is undefined', () => {
    expect(interpolateCubehelixLong(hcl(NaN, NaN, 0), '#f60')(0.5) + '').toBe('rgb(162, 41, 0)');
    expect(interpolateCubehelixLong(hcl(NaN, NaN, 0), '#6f0')(0.5) + '').toBe('rgb(3, 173, 0)');
  });

  it('interpolateCubehelixLong(a, b) uses a’s chroma when b’s chroma is undefined', () => {
    expect(interpolateCubehelixLong('#ccc', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(102, 102, 102)');
    expect(interpolateCubehelixLong('#f00', hcl(NaN, NaN, 0))(0.5) + '').toBe('rgb(147, 0, 0)');
  });

  it('interpolateCubehelixLong(a, b) uses b’s chroma when a’s chroma is undefined', () => {
    expect(interpolateCubehelixLong(hcl(NaN, NaN, 0), '#ccc')(0.5) + '').toBe('rgb(102, 102, 102)');
    expect(interpolateCubehelixLong(hcl(NaN, NaN, 0), '#f00')(0.5) + '').toBe('rgb(147, 0, 0)');
  });

  it('interpolateCubehelixLong(a, b) uses b’s luminance when a’s luminance is undefined', () => {
    expect(interpolateCubehelixLong(null, cubehelix(20, 1.5, 0.5))(0.5) + '').toBe('rgb(248, 93, 0)');
  });

  it('interpolateCubehelixLong(a, b) uses a’s luminance when b’s luminance is undefined', () => {
    expect(interpolateCubehelixLong(cubehelix(20, 1.5, 0.5), null)(0.5) + '').toBe('rgb(248, 93, 0)');
  });

});
