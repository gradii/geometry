/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Hsl, Rgb, rgb } from '@gradii/color';
import { interpolateRgb } from '../public-api';
import { interpolateRgbFactory } from '../src/wrapper/interpolate-rgb';

describe('test interpolate rgb', () => {
  it('interpolateRgb(a, b) converts a and b to RGB colors', () => {
    expect(interpolateRgb('steelblue', 'brown')(0) + '').toBe(rgb('steelblue') + '');
    expect(interpolateRgb('steelblue', Hsl.create('brown'))(1) + '').toBe(rgb('brown') + '');
    expect(interpolateRgb('steelblue', Rgb.create('brown'))(1) + '').toBe(rgb('brown') + '');
  });

  it('interpolateRgb(a, b) interpolates in RGB and returns an RGB string', () => {
    expect(interpolateRgb('steelblue', '#f00')(0.2) + '').toBe('rgb(107, 104, 144)');
    expect(interpolateRgb('rgba(70, 130, 180, 1)', 'rgba(255, 0, 0, 0.2)')(0.2) + '').toBe('rgba(107, 104, 144, 0.84)');
  });

  it('interpolateRgb(a, b) uses b’s channel value when a’s channel value is undefined', () => {
    expect(interpolateRgb(null, rgb(20, 40, 60))(0.5) + '').toBe(rgb(20, 40, 60) + '');
    expect(interpolateRgb(rgb(NaN, 20, 40), rgb(60, 80, 100))(0.5) + '').toBe(rgb(60, 50, 70) + '');
    expect(interpolateRgb(rgb(20, NaN, 40), rgb(60, 80, 100))(0.5) + '').toBe(rgb(40, 80, 70) + '');
    expect(interpolateRgb(rgb(20, 40, NaN), rgb(60, 80, 100))(0.5) + '').toBe(rgb(40, 60, 100) + '');
  });

  it('interpolateRgb(a, b) uses a’s channel value when b’s channel value is undefined', () => {
    expect(interpolateRgb(rgb(20, 40, 60), null)(0.5) + '').toBe(rgb(20, 40, 60) + '');
    expect(interpolateRgb(rgb(60, 80, 100), rgb(NaN, 20, 40))(0.5) + '').toBe(rgb(60, 50, 70) + '');
    expect(interpolateRgb(rgb(60, 80, 100), rgb(20, NaN, 40))(0.5) + '').toBe(rgb(40, 80, 70) + '');
    expect(interpolateRgb(rgb(60, 80, 100), rgb(20, 40, NaN))(0.5) + '').toBe(rgb(40, 60, 100) + '');
  });

  it('interpolateRgbFactory(3)(a, b) returns the expected values', () => {
    expect(interpolateRgbFactory(3)('steelblue', '#f00')(0.2) + '').toBe('rgb(153, 121, 167)');
  });

  it('interpolateRgbFactory(3)(a, b) uses linear interpolation for opacity', () => {
    expect(interpolateRgbFactory(3)('transparent', '#f00')(0.2) + '').toBe('rgba(255, 0, 0, 0.2)');
  });

  // it('interpolateRgb.gamma(g) coerces the specified gamma to a number', () => {
  //   expect(interpolateRgbFactory({valueOf() {return 3;}})('steelblue', '#f00')(0.2)).toBe('rgb(153, 121, 167)');
  // });

  it('interpolateRgb(a, b) is equivalent to interpolateRgb.gamma(1)(a, b)', () => {
    let i0 = interpolateRgbFactory(1)('purple', 'orange'),
        i1 = interpolateRgb('purple', 'orange');
    expect(i1(0.0).toString()).toBe(i0(0.0).toString());
    expect(i1(0.2).toString()).toBe(i0(0.2).toString());
    expect(i1(0.4).toString()).toBe(i0(0.4).toString());
    expect(i1(0.6).toString()).toBe(i0(0.6).toString());
    expect(i1(0.8).toString()).toBe(i0(0.8).toString());
    expect(i1(1.0).toString()).toBe(i0(1.0).toString());
  });

});
