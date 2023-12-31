/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { hsl, rgb } from '@gradii/color';
import { interpolateHsl } from '../public-api';

describe('test interpolate hsl', () => {
  it('interpolateHsl(a, b) converts a and b to HSL colors', () => {
    expect(interpolateHsl('steelblue', 'brown')(0) + '').toBe(rgb('steelblue') + '');
    expect(interpolateHsl('steelblue', hsl('brown'))(1) + '').toBe(rgb('brown') + '');
    expect(interpolateHsl('steelblue', rgb('brown'))(1) + '').toBe(rgb('brown') + '');
  });

  it('interpolateHsl(a, b) interpolates in HSL and returns an RGB string', () => {
    expect(interpolateHsl('steelblue', '#f00')(0.2) + '').toBe('rgb(56, 195, 162)');
    expect(interpolateHsl('rgba(70, 130, 180, 1)', 'rgba(255, 0, 0, 0.2)')(0.2) + '').toBe('rgba(56, 195, 162, 0.84)');
  });

  it('interpolateHsl(a, b) uses the negative path when interpolating hue', () => {
    let i = interpolateHsl('hsl(10,50%,50%)', 'hsl(-10,50%,50%)');
    expect(i(0.0) + '').toBe('rgb(191, 85, 64)');
    expect(i(0.2) + '').toBe('rgb(191, 77, 64)');
    expect(i(0.4) + '').toBe('rgb(191, 68, 64)');
    expect(i(0.6) + '').toBe('rgb(191, 64, 68)');
    expect(i(0.8) + '').toBe('rgb(191, 64, 77)');
    expect(i(1.0) + '').toBe('rgb(191, 64, 85)');
  });

  it('interpolateHsl(a, b) uses the linear path when interpolating hue', () => {
    let i = interpolateHsl('hsl(10,50%,50%)', 'hsl(350,50%,50%)');
    expect(i(0.0) + '').toBe('rgb(191, 85, 64)');
    expect(i(0.2) + '').toBe('rgb(153, 191, 64)');
    expect(i(0.4) + '').toBe('rgb(64, 191, 119)');
    expect(i(0.6) + '').toBe('rgb(64, 119, 191)');
    expect(i(0.8) + '').toBe('rgb(153, 64, 191)');
    expect(i(1.0) + '').toBe('rgb(191, 64, 85)');
  });

  it('interpolateHsl(a, b) uses a’s hue when b’s hue is undefined', () => {
    expect(interpolateHsl('#f60', '#000')(0.5) + '').toBe('rgb(128, 51, 0)');
    expect(interpolateHsl('#6f0', '#fff')(0.5) + '').toBe('rgb(179, 255, 128)');
  });

  it('interpolateHsl(a, b) uses b’s hue when a’s hue is undefined', () => {
    expect(interpolateHsl('#000', '#f60')(0.5) + '').toBe('rgb(128, 51, 0)');
    expect(interpolateHsl('#fff', '#6f0')(0.5) + '').toBe('rgb(179, 255, 128)');
  });

  it('interpolateHsl(a, b) uses a’s saturation when b’s saturation is undefined', () => {
    expect(interpolateHsl('#ccc', '#000')(0.5) + '').toBe('rgb(102, 102, 102)');
    expect(interpolateHsl('#f00', '#000')(0.5) + '').toBe('rgb(128, 0, 0)');
  });

  it('interpolateHsl(a, b) uses b’s saturation when a’s saturation is undefined', () => {
    expect(interpolateHsl('#000', '#ccc')(0.5) + '').toBe('rgb(102, 102, 102)');
    expect(interpolateHsl('#000', '#f00')(0.5) + '').toBe('rgb(128, 0, 0)');
  });

  it('interpolateHsl(a, b) uses b’s lightness when a’s lightness is undefined', () => {
    expect(interpolateHsl(null, hsl(20, 1.0, 0.5))(0.5) + '').toBe('rgb(255, 85, 0)');
  });

  it('interpolateHsl(a, b) uses a’s lightness when b’s lightness is undefined', () => {
    expect(interpolateHsl(hsl(20, 1.0, 0.5), null)(0.5) + '').toBe('rgb(255, 85, 0)');
  });

});
