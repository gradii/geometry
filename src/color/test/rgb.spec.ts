import { Color } from '../src/color';
import { hsl } from '../src/hsl';
import { rgb, Rgb } from '../src/rgb';
import { rgbEqual, rgbStrictEqual } from './test-helper';

describe('test color rgb', () => {

  it('instant a new rgb without param should be NaN', () => {
    const rgb_1 = new Rgb();
    expect(rgb_1.r).toBeNaN();
    expect(rgb_1.g).toBeNaN();
    expect(rgb_1.b).toBeNaN();
  });

  it('instant a new rgb with param should return right rgb', () => {
    const rgb_1 = new Rgb(0, 0, 0);
    expect(rgb_1.r).toBe(0);
    expect(rgb_1.g).toBe(0);
    expect(rgb_1.b).toBe(0);
  });

  it('set r g b property should return right rgb', () => {
    const rgb_1 = new Rgb();
    rgb_1.r     = 23;
    expect(rgb_1.toString()).toBe('rgb(23, 0, 0)');
    rgb_1.g = 24;
    expect(rgb_1.toString()).toBe('rgb(23, 24, 0)');
    rgb_1.b = 25;
    expect(rgb_1.toString()).toBe('rgb(23, 24, 25)');

    const rgb_2 = new Rgb(23, 24, 25, 1);
    expect(rgb_2.toString()).toBe('rgb(23, 24, 25)');

    const rgb_3 = new Rgb(23, 24, 25, 0.5);
    expect(rgb_3.toString()).toBe('rgba(23, 24, 25, 0.5)');

    const rgb_4 = new Rgb(23, 24, 25, 0);
    expect(rgb_4.toString()).toBe('rgba(23, 24, 25, 0)');
  });

  it('brighter rgb color should return brighter color', () => {
    const rgb_1   = new Rgb(0, 0, 0, 0);
    const n_rgb_1 = rgb_1.brighter();
    expect(n_rgb_1.toString()).toBe('rgba(0, 0, 0, 0)');
    const n_rgb_2 = rgb_1.brighter(1);
    expect(n_rgb_2.toString()).toBe('rgba(0, 0, 0, 0)');
    const n_rgb_3 = rgb_1.brighter(2);
    expect(n_rgb_3.toString()).toBe('rgba(0, 0, 0, 0)');

    const rgb_2    = new Rgb(1, 1, 1, 1);
    const n2_rgb_2 = rgb_2.brighter(2);
    expect(n2_rgb_2.toString()).toBe('rgb(2, 2, 2)');

    const rgb_3    = new Rgb(1, 1, 1, 0.5);
    const n2_rgb_3 = rgb_3.brighter(2);
    expect(n2_rgb_3.toString()).toBe('rgba(2, 2, 2, 0.5)');
  });

  it('rgb(…) returns an instance of rgb and color', () => {
    let c = rgb(70, 130, 180);
    expect(c instanceof Rgb).toBe(true);
    expect(c instanceof Color).toBe(true);
  });

  it('rgb(…) exposes r, g and b channel values and opacity', () => {
    rgbEqual(rgb('#abc'), 170, 187, 204, 1);
    rgbEqual(rgb('rgba(170, 187, 204, 0.4)'), 170, 187, 204, 0.4);
  });

  it('rgb.toString() formats as rgb(…) or rgba(…)', () => {
    expect(rgb('#abcdef') + '').toBe('rgb(171, 205, 239)');
    expect(rgb('moccasin') + '').toBe('rgb(255, 228, 181)');
    expect(rgb('hsl(60, 100%, 20%)') + '').toBe('rgb(102, 102, 0)');
    expect(rgb('rgb(12, 34, 56)') + '').toBe('rgb(12, 34, 56)');
    expect(rgb(rgb(12, 34, 56)) + '').toBe('rgb(12, 34, 56)');
    expect(rgb(hsl(60, 1, 0.2)) + '').toBe('rgb(102, 102, 0)');
    expect(rgb('rgba(12, 34, 56, 0.4)') + '').toBe('rgba(12, 34, 56, 0.4)');
    expect(rgb('rgba(12%, 34%, 56%, 0.4)') + '').toBe('rgba(31, 87, 143, 0.4)');
    expect(rgb('hsla(60, 100%, 20%, 0.4)') + '').toBe('rgba(102, 102, 0, 0.4)');
  });

  it('rgb.toString() reflects r, g and b channel values and opacity', () => {
    let c = rgb('#abc');
    ++c.r, ++c.g, ++c.b, c.opacity = 0.5;
    expect(c + '').toBe('rgba(171, 188, 205, 0.5)');
  });

  it('rgb.toString() treats undefined channel values as 0', () => {
    expect(rgb('invalid') + '').toBe('rgb(0, 0, 0)');
    expect(rgb(NaN, 12, 34) + '').toBe('rgb(0, 12, 34)');
  });

  it('rgb.toString() treats undefined opacity as 1', () => {
    let c = rgb('#abc');
    ++c.r, ++c.g, ++c.b, c.opacity = NaN;
    expect(c + '').toBe('rgb(171, 188, 205)');
  });

  it('rgb.toString() clamps r, g, b and opacity channel values', () => {
    expect(rgb(-1, 2, 3) + '').toBe('rgb(0, 2, 3)');
    expect(rgb(2, -1, 3) + '').toBe('rgb(2, 0, 3)');
    expect(rgb(2, 3, -1) + '').toBe('rgb(2, 3, 0)');
    expect(rgb(2, 3, -1, -0.2) + '').toBe('rgba(2, 3, 0, 0)');
    expect(rgb(2, 3, -1, 1.2) + '').toBe('rgb(2, 3, 0)');
  });

  it('rgb.toString() rounds r, g and b channel values', () => {
    expect(rgb(0.5, 2.0, 3.0) + '').toBe('rgb(1, 2, 3)');
    expect(rgb(2.0, 0.5, 3.0) + '').toBe('rgb(2, 1, 3)');
    expect(rgb(2.0, 3.0, 0.5) + '').toBe('rgb(2, 3, 1)');
  });

  it('rgb(r, g, b) does not round channel values', () => {
    rgbStrictEqual(rgb(1.2, 2.6, 42.9), 1.2, 2.6, 42.9, 1);
  });

  // it('rgb(r, g, b) does not clamp channel values', () => {
  //   rgbEqual(rgb(-10, -20, -30), -10, -20, -30, 1);
  //   rgbEqual(rgb(300, 400, 500), 300, 400, 500, 1);
  // });

  // it('rgb(r, g, b, opacity) does not clamp opacity', () => {
  //   rgbEqual(rgb(-10, -20, -30, -0.2), -10, -20, -30, -0.2);
  //   rgbEqual(rgb(300, 400, 500, 1.2), 300, 400, 500, 1.2);
  // });

  it('rgb(r, g, b) coerces channel values to numbers', () => {
    rgbEqual(rgb('12', '34', '56'), 12, 34, 56, 1);
    rgbEqual(rgb(null, null, null), 0, 0, 0, 1);
  });

  // it('rgb(r, g, b, opacity) coerces opacity to number', () => {
  //   rgbStrictEqual(rgb(-10, -20, -30, '-0.2'), -10, -20, -30, -0.2);
  //   rgbStrictEqual(rgb(300, 400, 500, '1.2'), 300, 400, 500, 1.2);
  // });

  it('rgb(r, g, b) allows undefined channel values', () => {
    rgbEqual(rgb(undefined, NaN, 'foo'), NaN, NaN, NaN, 1);
    rgbEqual(rgb(undefined, 42, 56), NaN, 42, 56, 1);
    rgbEqual(rgb(42, undefined, 56), 42, NaN, 56, 1);
    rgbEqual(rgb(42, 56, undefined), 42, 56, NaN, 1);
  });

  it('rgb(r, g, b, opacity) converts undefined opacity to 1', () => {
    // rgbEqual(rgb(10, 20, 30, null), 10, 20, 30, 1);
    rgbEqual(rgb(10, 20, 30, undefined), 10, 20, 30, 1);
  });

  it('rgb(format) parses the specified format and converts to RGB', () => {
    rgbEqual(rgb('#abcdef'), 171, 205, 239, 1);
    rgbEqual(rgb('#abc'), 170, 187, 204, 1);
    rgbEqual(rgb('rgb(12, 34, 56)'), 12, 34, 56, 1);
    rgbEqual(rgb('rgb(12%, 34%, 56%)'), 31, 87, 143, 1);
    rgbEqual(rgb('hsl(60,100%,20%)'), 102, 102, 0, 1);
    rgbEqual(rgb('aliceblue'), 240, 248, 255, 1);
    rgbEqual(rgb('hsla(60,100%,20%,0.4)'), 102, 102, 0, 0.4);
  });

  // it('rgb(format) ignores all channels if the alpha is <= 0', () => {
  //   rgbEqual(rgb('rgba(12,34,45,0)'), NaN, NaN, NaN, 0);
  //   rgbEqual(rgb('rgba(12,34,45,-0.1)'), NaN, NaN, NaN, -0.1);
  // });

  it('rgb(format) returns undefined channel values for unknown formats', () => {
    rgbEqual(rgb('invalid'), NaN, NaN, NaN, 1);
  });

  it('rgb(rgb) copies an RGB color', () => {
    let c1 = rgb('rgba(70, 130, 180, 0.4)'),
        c2 = rgb(c1);
    rgbEqual(c1, 70, 130, 180, 0.4);
    c1.r = c1.g = c1.b = c1.opacity = 0;
    rgbEqual(c1, 0, 0, 0, 0);
    rgbEqual(c2, 70, 130, 180, 0.4);
  });

  it('rgb(hsl) converts from HSL', () => {
    rgbEqual(rgb(hsl(0, 1, 0.5)), 255, 0, 0, 1);
    rgbEqual(rgb(hsl(0, 1, 0.5, 0.4)), 255, 0, 0, 0.4);
  });

  // it('rgb(color) converts from another colorspace via rgb()', () => {
  //   function TestColor() {}
  //
  //   TestColor.prototype          = Object.create(color.color.prototype);
  //   TestColor.prototype.rgb      = function () { return rgb(12, 34, 56, 0.4); };
  //   TestColor.prototype.toString = function () { throw new Error('should use rgb, not toString'); };
  //   rgbEqual(rgb(new TestColor), 12, 34, 56, 0.4);
  // });

  // it('rgb.displayable() returns true if the color is within the RGB gamut and opacity is in [0,1]', () => {
  //   expect(rgb('white').displayable()).toBe(true);
  //   expect(rgb('red').displayable()).toBe(true);
  //   expect(rgb('black').displayable()).toBe(true);
  //   expect(rgb('invalid').displayable()).toBe(false);
  //   expect(rgb(-1, 0, 0).displayable()).toBe(false);
  //   expect(rgb(0, -1, 0).displayable()).toBe(false);
  //   expect(rgb(0, 0, -1).displayable()).toBe(false);
  //   expect(rgb(256, 0, 0).displayable()).toBe(false);
  //   expect(rgb(0, 256, 0).displayable()).toBe(false);
  //   expect(rgb(0, 0, 256).displayable()).toBe(false);
  //   expect(rgb(0, 0, 255, 0).displayable()).toBe(true);
  //   expect(rgb(0, 0, 255, 1.2).displayable()).toBe(false);
  //   expect(rgb(0, 0, 255, -0.2).displayable()).toBe(false);
  // });

  it('rgb.brighter(k) returns a brighter color if k > 0', () => {
    let c = rgb('rgba(165, 42, 42, 0.4)');
    rgbEqual(c.brighter(0.5), 197, 50, 50, 0.4);
    rgbEqual(c.brighter(1), 236, 60, 60, 0.4);
    rgbEqual(c.brighter(2), 255, 86, 86, 0.4);
  });

  it('rgb.brighter(k) returns a copy', () => {
    let c1 = rgb('rgba(70, 130, 180, 0.4)'),
        c2 = c1.brighter(1);
    rgbEqual(c1, 70, 130, 180, 0.4);
    rgbEqual(c2, 100, 186, 255, 0.4);
  });

  it('rgb.brighter() is equivalent to rgb.brighter(1)', () => {
    let c1 = rgb('rgba(70, 130, 180, 0.4)'),
        c2 = c1.brighter(),
        c3 = c1.brighter(1);
    rgbEqual(c2, c3.r, c3.g, c3.b, 0.4);
  });

  it('rgb.brighter(k) is equivalent to rgb.darker(-k)', () => {
    let c1 = rgb('rgba(70, 130, 180, 0.4)'),
        c2 = c1.brighter(1.5),
        c3 = c1.darker(-1.5);
    rgbEqual(c2, c3.r, c3.g, c3.b, 0.4);
  });

  it('rgb("black").brighter() still returns black', () => {
    let c1 = rgb('black'),
        c2 = c1.brighter(1);
    rgbEqual(c1, 0, 0, 0, 1);
    rgbEqual(c2, 0, 0, 0, 1);
  });

  it('rgb.darker(k) returns a darker color if k > 0', () => {
    let c = rgb('rgba(165, 42, 42, 0.4)');
    rgbEqual(c.darker(0.5), 138, 35, 35, 0.4);
    rgbEqual(c.darker(1), 115, 29, 29, 0.4);
    rgbEqual(c.darker(2), 81, 21, 21, 0.4);
  });

  it('rgb.darker(k) returns a copy', () => {
    let c1 = rgb('rgba(70, 130, 180, 0.4)'),
        c2 = c1.darker(1);
    rgbEqual(c1, 70, 130, 180, 0.4);
    rgbEqual(c2, 49, 91, 126, 0.4);
  });

  it('rgb.darker() is equivalent to rgb.darker(1)', () => {
    let c1 = rgb('rgba(70, 130, 180, 0.4)'),
        c2 = c1.darker(),
        c3 = c1.darker(1);
    rgbEqual(c2, c3.r, c3.g, c3.b, 0.4);
  });

  it('rgb.darker(k) is equivalent to rgb.brighter(-k)', () => {
    let c1 = rgb('rgba(70, 130, 180, 0.4)'),
        c2 = c1.darker(1.5),
        c3 = c1.brighter(-1.5);
    rgbEqual(c2, c3.r, c3.g, c3.b, 0.4);
  });

  it('rgb.rgb() returns this', () => {
    let c = rgb(70, 130, 180);
    expect(c.rgb()).toBe(c);
  });
});
