import { Color } from '../src/color';
import { hcl, Hcl } from '../src/hcl';
import { hsl } from '../src/hsl';
import { lab } from '../src/lab';
import { rgb } from '../src/rgb';
import { hclEqual, rgbEqual } from './test-helper';

describe('test color hcl', () => {
  it('hcl(…) returns an instance of hcl and color', () => {
    const c = hcl(120, 40, 50);
    expect(c instanceof Hcl).toBe(true);
    expect(c instanceof Color).toBe(true);
  });

  it('hcl(…) exposes h, c, and l channel values', () => {
    hclEqual(hcl('#abc'), 257.7541500962552, 10.782035034714964, 75.10557357383627, 1);
  });

  it('hcl(…) returns defined hue and chroma, even for black and white', () => {
    hclEqual(hcl('black'), NaN, 0, 0, 1);
    hclEqual(hcl('#000'), NaN, 0, 0, 1);
    hclEqual(hcl(lab('#000')), NaN, 0, 0, 1);
    hclEqual(hcl('white'), NaN, 0, 100, 1);
    hclEqual(hcl('#fff'), NaN, 0, 100, 1);
    hclEqual(hcl(lab('#fff')), NaN, 0, 100, 1);
  });

  it('hcl.toString() converts to RGB and formats as hexadecimal', () => {
    expect(hcl('#abcdef') + '').toBe('rgb(171, 205, 239)');
    expect(hcl('moccasin') + '').toBe('rgb(255, 228, 181)');
    expect(hcl('hsl(60, 100%, 20%)') + '').toBe('rgb(102, 102, 0)');
    expect(hcl('rgb(12, 34, 56)') + '').toBe('rgb(12, 34, 56)');
    expect(hcl(rgb(12, 34, 56)) + '').toBe('rgb(12, 34, 56)');
    expect(hcl(hsl(60, 1, 0.2)) + '').toBe('rgb(102, 102, 0)');
  });

  it('hcl.toString() reflects h, c and l channel values', () => {
    let c = hcl('#abc');
    c.h += 10, c.c += 1, c.l -= 1;
    expect(c + '').toBe('rgb(170, 183, 204)');
  });

  it('hcl.toString() treats undefined opacity as 1', () => {
    let c     = hcl('#abc');
    c.opacity = NaN;
    expect(c + '').toBe('rgb(170, 187, 204)');
  });

  it('hcl.toString() treats undefined channel values as 0', () => {
    expect(hcl('invalid') + '').toBe('rgb(0, 0, 0)');
    expect(hcl('#000') + '').toBe('rgb(0, 0, 0)');
    expect(hcl('#ccc') + '').toBe('rgb(204, 204, 204)');
    expect(hcl('#fff') + '').toBe('rgb(255, 255, 255)');
    expect(hcl(NaN, 20, 40) + '').toBe('rgb(94, 94, 94)'); // equivalent to hcl(*, *, 40)
    expect(hcl(120, NaN, 40) + '').toBe('rgb(94, 94, 94)');
    expect(hcl(0, NaN, 40) + '').toBe('rgb(94, 94, 94)');
    expect(hcl(120, 50, NaN) + '').toBe('rgb(0, 0, 0)'); // equivalent to hcl(*, *, 0)
    expect(hcl(0, 50, NaN) + '').toBe('rgb(0, 0, 0)');
    expect(hcl(120, 0, NaN) + '').toBe('rgb(0, 0, 0)');
  });

  it('hcl(h, c, l) does not wrap hue to [0,360)', () => {
    hclEqual(hcl(-10, 40, 50), -10, 40, 50, 1);
    hclEqual(hcl(0, 40, 50), 0, 40, 50, 1);
    hclEqual(hcl(360, 40, 50), 360, 40, 50, 1);
    hclEqual(hcl(370, 40, 50), 370, 40, 50, 1);
  });

  it('hcl(h, c, l) does not clamp l channel value', () => {
    hclEqual(hcl(120, 20, -10), 120, 20, -10, 1);
    hclEqual(hcl(120, 20, 0), 120, 20, 0, 1);
    hclEqual(hcl(120, 20, 100), 120, 20, 100, 1);
    hclEqual(hcl(120, 20, 110), 120, 20, 110, 1);
  });

  it('hcl(h, c, l, opacity) does not clamp opacity to [0,1]', () => {
    hclEqual(hcl(120, 20, 100, -0.2), 120, 20, 100, -0.2);
    hclEqual(hcl(120, 20, 110, 1.2), 120, 20, 110, 1.2);
  });

  it('hcl(h, c, l) coerces channel values to numbers', () => {
    hclEqual(hcl('120', '40', '50'), 120, 40, 50, 1);
  });

  // it('hcl(h, c, l, opacity) coerces opacity to number', () => {
  //   hclEqual(hcl(120, 40, 50, '0.2'), 120, 40, 50, 0.2);
  // });

  it('hcl(h, c, l) allows undefined channel values', () => {
    hclEqual(hcl(undefined, NaN, 'foo'), NaN, NaN, NaN, 1);
    hclEqual(hcl(undefined, 40, 50), NaN, 40, 50, 1);
    hclEqual(hcl(42, undefined, 50), 42, NaN, 50, 1);
    hclEqual(hcl(42, 40, undefined), 42, 40, NaN, 1);
  });

  it('hcl(h, c, l, opacity) converts undefined opacity to 1', () => {
    // hclEqual(hcl(10, 20, 30, null), 10, 20, 30, 1);
    hclEqual(hcl(10, 20, 30, undefined), 10, 20, 30, 1);
  });

  it('hcl(format) parses the specified format and converts to HCL', () => {
    hclEqual(hcl('#abcdef'), 259.86450362987785, 20.77604833496412, 81.04502986916337, 1);
    hclEqual(hcl('#abc'), 257.7541500962552, 10.782035034714964, 75.10557357383627, 1);
    hclEqual(hcl('rgb(12, 34, 56)'), 270.4291275292669, 16.836385281554094, 12.65718955349287, 1);
    hclEqual(hcl('rgb(12%, 34%, 56%)'), 274.0409738642107, 36.29475501842534, 36.042294938565256, 1);
    hclEqual(hcl('rgba(12%, 34%, 56%, 0.4)'), 274.0409738642107, 36.29475501842534, 36.042294938565256, 0.4);
    hclEqual(hcl('hsl(60,100%,20%)'), 102.85189620924648, 49.4512050765872, 41.731998930736594, 1);
    hclEqual(hcl('hsla(60,100%,20%,0.4)'), 102.85189620924648, 49.4512050765872, 41.731998930736594, 0.4);
    hclEqual(hcl('aliceblue'), 252.55137587903926, 4.479225300380237, 97.17890760827636, 1);
  });

  it('hcl(format) returns undefined channel values for unknown formats', () => {
    hclEqual(hcl('invalid'), NaN, NaN, NaN, 1);
  });

  it('hcl(hcl) copies an HCL color', () => {
    let c1 = hcl(120, 30, 50, 0.4),
        c2 = hcl(c1);
    hclEqual(c1, 120, 30, 50, 0.4);
    c1.h = c1.c = c1.l = c1.opacity = 0;
    hclEqual(c1, 0, 0, 0, 0);
    hclEqual(c2, 120, 30, 50, 0.4);
  });

  it('hcl(lab) returns h = NaN if a and b are zero', () => {
    hclEqual(hcl(lab(0, 0, 0)), NaN, 0, 0, 1);
    hclEqual(hcl(lab(50, 0, 0)), NaN, 0, 50, 1);
    hclEqual(hcl(lab(100, 0, 0)), NaN, 0, 100, 1);
    hclEqual(hcl(lab(0, 10, 0)), 0, 10, 0, 1);
    hclEqual(hcl(lab(50, 10, 0)), 0, 10, 50, 1);
    hclEqual(hcl(lab(100, 10, 0)), 0, 10, 100, 1);
    hclEqual(hcl(lab(0, 0, 10)), 90, 10, 0, 1);
    hclEqual(hcl(lab(50, 0, 10)), 90, 10, 50, 1);
    hclEqual(hcl(lab(100, 0, 10)), 90, 10, 100, 1);
  });

  it('hcl(rgb) converts from RGB', () => {
    hclEqual(hcl(rgb(255, 0, 0, 0.4)), 40.00015790646365, 104.57551843993618, 53.23288178584245, 0.4);
  });

  // it('hcl(color) converts from another colorspace via color.rgb()', () => {
  //   function TestColor() {}
  //   TestColor.prototype = Object.create(color.color.prototype);
  //   TestColor.prototype.rgb = function() { return color.rgb(12, 34, 56, 0.4); };
  //   TestColor.prototype.toString = function() { throw new Error('should use rgb, not toString'); };
  //   hclEqual(hcl(new TestColor), 262.8292023352897, 17.30347233219686, 12.404844123471648, 0.4);
  // });

  it('hcl.darker(k) returns a darker color if k > 0', () => {
    let c = hcl('rgba(165, 42, 42, 0.4)');
    hclEqual(c.darker(0.5), 31.570516287754863, 58.33332099430836, 28.521829744034335, 0.4);
    hclEqual(c.darker(1), 31.570516287754863, 58.33332099430836, 19.521829744034335, 0.4);
    hclEqual(c.darker(2), 31.570516287754863, 58.33332099430836,  1.521829744034335, 0.4);
  });

  it('hcl.darker(k) returns a copy', () => {
    let c1 = hcl('rgba(70, 130, 180, 0.4)'),
        c2 = c1.darker(1);
    hclEqual(c1, 262.7954660690302, 32.454394379104286, 52.4674724151205, 0.4);
    hclEqual(c2, 262.7954660690302, 32.454394379104286, 34.4674724151205, 0.4);
  });

  it('hcl.brighter() is equivalent to hcl.brighter(1)', () => {
    let c1 = hcl('rgba(70, 130, 180, 0.4)'),
        c2 = c1.brighter(),
        c3 = c1.brighter(1);
    hclEqual(c2, c3.h, c3.c, c3.l, 0.4);
  });

  it('hcl.brighter(k) is equivalent to hcl.darker(-k)', () => {
    let c1 = hcl('rgba(70, 130, 180, 0.4)'),
        c2 = c1.brighter(1.5),
        c3 = c1.darker(-1.5);
    hclEqual(c2, c3.h, c3.c, c3.l, 0.4);
  });

  it('hcl.darker(k) returns a darker color if k > 0', () => {
    let c = hcl('rgba(165, 42, 42, 0.4)');
    hclEqual(c.darker(0.5), 31.570516287754863, 58.33332099430836, 28.521829744034335, 0.4);
    hclEqual(c.darker(1), 31.570516287754863, 58.33332099430836, 19.521829744034335, 0.4);
    hclEqual(c.darker(2), 31.570516287754863, 58.33332099430836, 1.521829744034335, 0.4);
  });

  it('hcl.darker(k) returns a copy', () => {
    let c1 = hcl('rgba(70, 130, 180, 0.4)'),
        c2 = c1.darker(1);
    hclEqual(c1, 262.7954660690302, 32.454394379104286, 52.4674724151205, 0.4);
    hclEqual(c2, 262.7954660690302, 32.454394379104286, 34.4674724151205, 0.4);
  });

  it('hcl.darker() is equivalent to hcl.darker(1)', () => {
    let c1 = hcl('rgba(70, 130, 180, 0.4)'),
        c2 = c1.darker(),
        c3 = c1.darker(1);
    hclEqual(c2, c3.h, c3.c, c3.l, 0.4);
  });

  it('hcl.darker(k) is equivalent to hcl.brighter(-k)', () => {
    let c1 = hcl('rgba(70, 130, 180, 0.4)'),
        c2 = c1.darker(1.5),
        c3 = c1.brighter(-1.5);
    hclEqual(c2, c3.h, c3.c, c3.l, 0.4);
  });

  it('hcl.rgb() converts to RGB', () => {
    let c = hcl(120, 30, 50, 0.4);
    rgbEqual(c.rgb(), 109, 125, 74, 0.4);
  });

});
