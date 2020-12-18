/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import { createColor } from '../public-api';
import { create, hex } from '../src/helper';
import { Hsl } from '../src/hsl';
import { Rgb } from '../src/rgb';
import { expectEqualRgb, expectEqualRgba, hslEqual, rgbEqual, rgbStrictEqual } from './test-helper';

describe('test color', () => {
    it('hex `0` should be 0', () => {
      expect(hex(0)).toBe('00');
    });

    it('hex color less than 16 should be pad with `0`', () => {
      expect(hex(0)).toBe('00');
      expect(hex(1)).toBe('01');
      expect(hex(15)).toBe('0f');
      expect(hex(16)).toBe('10');
      expect(hex(255)).toBe('ff');
    });

    it('create color with hex3 string should return right color', () => {
      const hex3 = create('#000') as Rgb;
      expectEqualRgb(hex3, new Rgb(0, 0, 0));
      const hex3_1 = create('#1af') as Rgb;
      expectEqualRgb(hex3_1, new Rgb(17, 170, 255));
    });

    it('create color with hex6 string should return right color', () => {
      const hex6 = create('#000000') as Rgb;
      expectEqualRgb(hex6, new Rgb(0, 0, 0));
      const hex6_1 = create('#23aedf') as Rgb;
      expectEqualRgb(hex6_1, new Rgb(35, 174, 223));
    });

    it('create color with rgb(int, int, int) should return right color', () => {
      const rgb_1 = create('rgb( 0, 0, 0)') as Rgb;
      expectEqualRgb(rgb_1, new Rgb(0, 0, 0));

      const rgb = create('rgb( 234, 23, 34)') as Rgb;
      expectEqualRgb(rgb, new Rgb(234, 23, 34));
    });

    it('create color with rgb(*%, *%, *%) should return right color', () => {
      const rgb_1 = create('rgb( 0%, .0%, 0%)') as Rgb;
      expectEqualRgb(rgb_1, new Rgb(0, 0, 0));

      const rgb = create('rgb( 34%, 23%, 34%)') as Rgb;
      expectEqualRgb(rgb, new Rgb(87, 59, 87));

      const rgb_2 = create('rgb( 50%, 100%, 200%)') as Rgb;
      expectEqualRgb(rgb_2, new Rgb(128, 255, 255));
    });

    it('create color with rgba(int, int, int, number) should return right color', () => {
      const rgb_1 = create('rgba(0, 0, 0, 0)') as Rgb;
      expectEqualRgba(rgb_1, new Rgb(0, 0, 0, 0));

      const rgb_2 = create('rgba(23, 255, 46, 0.2)');
      expectEqualRgba(rgb_2, new Rgb(23, 255, 46, 0.2));

      const rgb_3 = create('rgba(23, 255, 46, 2)');
      expectEqualRgba(rgb_3, new Rgb(23, 255, 46, 1));
    });

    it('create color with rgba(*%, *%, *%, number) should return right color', () => {
      const rgb_1 = create('rgba(0%, 0%, 0%, 0)') as Rgb;
      expectEqualRgba(rgb_1, new Rgb(0, 0, 0, 0));

      const rgb_2 = create('rgba(23%, 100%, 46%, 0.2)');
      expectEqualRgba(rgb_2, new Rgb(59, 255, 117, 0.2));

      const rgb_3 = create('rgba(23%, 100%, 46%, 2)');
      expectEqualRgba(rgb_3, new Rgb(59, 255, 117, 1));
    });

    it('create color with hsl(number, *%, *%) should return right color', () => {
      const hsl_1 = create('hsl(0, 0%, 0%)') as Rgb;
      expectEqualRgb(hsl_1, new Rgb(0, 0, 0));

      const hsl_2 = create('hsl(23, 43%, 35%)') as Rgb;
      expectEqualRgb(hsl_2, new Rgb(0x80, 0x50, 0x33));
    });

    it('create color with hsla(number, *%, *%) should return right color', () => {
      const hsl_1 = create('hsla(0, 0%, 0%, 0)') as Rgb;
      expectEqualRgb(hsl_1, new Rgb(0, 0, 0));

      const hsl_2 = create('hsla(23, 43%, 35%, 1)') as Rgb;
      expectEqualRgb(hsl_2, new Rgb(0x80, 0x50, 0x33));
    });

    it('create color with hsla(number, *%, *%, number) should return right color', () => {
      const hsl_1 = create('hsla(0, 0%, 0%, 0)') as Hsl;
      expectEqualRgba(hsl_1, new Hsl(0, 0, 0, 0));
    });

    it('color(format) parses CSS color names (e.g., "rebeccapurple")', () => {
      rgbEqual(createColor('moccasin'), 255, 228, 181, 1);
      rgbEqual(createColor('aliceblue'), 240, 248, 255, 1);
      rgbEqual(createColor('yellow'), 255, 255, 0, 1);
      rgbEqual(createColor('moccasin'), 255, 228, 181, 1);
      rgbEqual(createColor('aliceblue'), 240, 248, 255, 1);
      rgbEqual(createColor('yellow'), 255, 255, 0, 1);
      rgbEqual(createColor('rebeccapurple'), 102, 51, 153, 1);
      rgbEqual(createColor('transparent'), NaN, NaN, NaN, 0);
    });

    it('color(format) parses 6-digit hexadecimal (e.g., "#abcdef")', () => {
      rgbEqual(createColor('#abcdef'), 171, 205, 239, 1);
    });

    it('color(format) parses 3-digit hexadecimal (e.g., "#abc")', () => {
      rgbEqual(createColor('#abc'), 170, 187, 204, 1);
    });

    it('color(format) parses RGB integer format (e.g., "rgb(12,34,56)")', () => {
      rgbEqual(createColor('rgb(12,34,56)'), 12, 34, 56, 1);
    });

    it('color(format) parses RGBA integer format (e.g., "rgba(12,34,56,0.4)")', () => {
      rgbEqual(createColor('rgba(12,34,56,0.4)'), 12, 34, 56, 0.4);
    });

    it('color(format) parses RGB percentage format (e.g., "rgb(12%,34%,56%)")', () => {
      rgbEqual(createColor('rgb(12%,34%,56%)'), 31, 87, 143, 1);
      rgbStrictEqual(createColor('rgb(100%,100%,100%)'), 255, 255, 255, 1);
    });

    it('color(format) parses RGBA percentage format (e.g., "rgba(12%,34%,56%,0.4)")', () => {
      rgbEqual(createColor('rgba(12%,34%,56%,0.4)'), 31, 87, 143, 0.4);
      rgbStrictEqual(createColor('rgba(100%,100%,100%,0.4)'), 255, 255, 255, 0.4);
    });

    it('color(format) parses HSL format (e.g., "hsl(60,100%,20%)")', () => {
      hslEqual(createColor('hsl(60,100%,20%)'), 60, 1, 0.2, 1);
    });

    it('color(format) parses HSLA format (e.g., "hsla(60,100%,20%,0.4)")', () => {
      hslEqual(createColor('hsla(60,100%,20%,0.4)'), 60, 1, 0.2, 0.4);
    });

    it('color(format) ignores leading and trailing whitespace', () => {
      rgbEqual(createColor(' aliceblue\t\n'), 240, 248, 255, 1);
      rgbEqual(createColor(' #abc\t\n'), 170, 187, 204, 1);
      rgbEqual(createColor(' #aabbcc\t\n'), 170, 187, 204, 1);
      rgbEqual(createColor(' rgb(120,30,50)\t\n'), 120, 30, 50, 1);
      hslEqual(createColor(' hsl(120,30%,50%)\t\n'), 120, 0.3, 0.5, 1);
    });

    it('color(format) ignores whitespace between numbers', () => {
      rgbEqual(createColor(' rgb( 120 , 30 , 50 ) '), 120, 30, 50, 1);
      hslEqual(createColor(' hsl( 120 , 30% , 50% ) '), 120, 0.3, 0.5, 1);
      rgbEqual(createColor(' rgba( 12 , 34 , 56 , 0.4 ) '), 12, 34, 56, 0.4);
      rgbEqual(createColor(' rgba( 12% , 34% , 56% , 0.4 ) '), 31, 87, 143, 0.4);
      hslEqual(createColor(' hsla( 60 , 100% , 20% , 0.4 ) '), 60, 1, 0.2, 0.4);
    });

    it('color(format) allows number signs', () => {
      rgbEqual(createColor('rgb(+120,+30,+50)'), 120, 30, 50, 1);
      hslEqual(createColor('hsl(+120,+30%,+50%)'), 120, 0.3, 0.5, 1);
      rgbEqual(createColor('rgb(-120,-30,-50)'), 0, 0, 0, 1);
      hslEqual(createColor('hsl(-120,-30%,-50%)'), NaN, NaN, -0.5, 1);
      rgbEqual(createColor('rgba(12,34,56,+0.4)'), 12, 34, 56, 0.4);
      rgbEqual(createColor('rgba(12,34,56,-0.4)'), NaN, NaN, NaN, 0);
      rgbEqual(createColor('rgba(12%,34%,56%,+0.4)'), 31, 87, 143, 0.4);
      rgbEqual(createColor('rgba(12%,34%,56%,-0.4)'), NaN, NaN, NaN, 0);
      hslEqual(createColor('hsla(60,100%,20%,+0.4)'), 60, 1, 0.2, 0.4);
      hslEqual(createColor('hsla(60,100%,20%,-0.4)'), NaN, NaN, NaN, -0.4);
    });

    it('color(format) allows decimals for non-integer values', () => {
      rgbEqual(createColor('rgb(20.0%,30.4%,51.2%)'), 51, 78, 131, 1);
      hslEqual(createColor('hsl(20.0,30.4%,51.2%)'), 20, 0.304, 0.512, 1);
    });

    it('color(format) allows leading decimal for hue, opacity and percentages', () => {
      hslEqual(createColor('hsl(.9,.3%,.5%)'), 0.9, 0.003, 0.005, 1);
      hslEqual(createColor('hsla(.9,.3%,.5%,.5)'), 0.9, 0.003, 0.005, 0.5);
      rgbEqual(createColor('rgb(.1%,.2%,.3%)'), 0, 1, 1, 1);
      rgbEqual(createColor('rgba(120,30,50,.5)'), 120, 30, 50, 0.5);
    });

    it('color(format) allows exponential format for hue, opacity and percentages', () => {
      hslEqual(createColor('hsl(1e1,2e1%,3e1%)'), 10, 0.2, 0.3, 1);
      hslEqual(createColor('hsla(9e-1,3e-1%,5e-1%,5e-1)'), 0.9, 0.003, 0.005, 0.5);
      rgbEqual(createColor('rgb(1e-1%,2e-1%,3e-1%)'), 0, 1, 1, 1);
      rgbEqual(createColor('rgba(120,30,50,1e-1)'), 120, 30, 50, 0.1);
    });

    it('color(format) does not allow decimals for integer values', () => {
      expect(createColor('rgb(120.5,30,50)')).toBeNull();
    });

    it('color(format) does not allow empty decimals', () => {
      expect(createColor('rgb(120.,30,50)')).toBeNull();
      expect(createColor('rgb(120.%,30%,50%)')).toBeNull();
      expect(createColor('rgba(120,30,50,1.)')).toBeNull();
      expect(createColor('rgba(12%,30%,50%,1.)')).toBeNull();
      expect(createColor('hsla(60,100%,20%,1.)')).toBeNull();
    });

    it('color(format) does not allow made-up names', () => {
      expect(createColor('bostock')).toBeNull();
    });

    it('color(format) does not allow whitespace before open paren or percent sign', () => {
      expect(createColor('rgb (120,30,50)')).toBeNull();
      expect(createColor('rgb (12%,30%,50%)')).toBeNull();
      expect(createColor('hsl (120,30%,50%)')).toBeNull();
      expect(createColor('hsl(120,30 %,50%)')).toBeNull();
      expect(createColor('rgba (120,30,50,1)')).toBeNull();
      expect(createColor('rgba (12%,30%,50%,1)')).toBeNull();
      expect(createColor('hsla (120,30%,50%,1)')).toBeNull();
    });

    it('color(format) is case-insensitive', () => {
      rgbEqual(createColor('aLiCeBlUE'), 240, 248, 255, 1);
      rgbEqual(createColor('transPARENT'), NaN, NaN, NaN, 0);
      rgbEqual(createColor(' #aBc\t\n'), 170, 187, 204, 1);
      rgbEqual(createColor(' #aaBBCC\t\n'), 170, 187, 204, 1);
      rgbEqual(createColor(' rGB(120,30,50)\t\n'), 120, 30, 50, 1);
      hslEqual(createColor(' HSl(120,30%,50%)\t\n'), 120, 0.3, 0.5, 1);
    });

    it('color(format) returns undefined RGB channel values for unknown formats', () => {
      expect(createColor('invalid')).toBeNull();
      expect(createColor('hasOwnProperty')).toBeNull();
      expect(createColor('__proto__')).toBeNull();
      expect(createColor('#ab')).toBeNull();
      expect(createColor('#abcd')).toBeNull();
    });

    it('color(format).hex() returns a hexadecimal string', () => {
      expect(createColor('rgba(12%,34%,56%,0.4)').hex()).toBe('#1f578f');
    });
  }
);
