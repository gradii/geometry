import { Hcl } from '../src/hcl';
import { Hsl } from '../src/hsl';
import { Rgb } from '../src/rgb';

export function expectEqualRgb(rgb1, rgb2) {

  expect(rgb1.hex()).toBe(rgb2.hex());
  // expect(rgb1.r).toBe(rgb2.r);
  // expect(rgb1.g).toBe(rgb2.g);
  // expect(rgb1.b).toBe(rgb2.b);
}

export function expectEqualRgba(rgba1, rgba2) {
  expect(rgba1.toString()).toBe(rgba2.toString());
}

export function rgbEqual(actual, r, g, b, opacity) {

  expect(actual instanceof Rgb
    && (isNaN(r) ? isNaN(actual.r) && actual.r !== actual.r : Math.round(actual.r) === Math.round(r))
    && (isNaN(g) ? isNaN(actual.g) && actual.g !== actual.g : Math.round(actual.g) === Math.round(g))
    && (isNaN(b) ? isNaN(actual.b) && actual.b !== actual.b : Math.round(actual.b) === Math.round(b))
    && (isNaN(opacity) ? isNaN(actual.opacity) && actual.opacity !== actual.opacity : actual.opacity === opacity)).toBe(true);

  expect([Math.round(actual.r), Math.round(actual.g), Math.round(actual.b), actual.opacity])
    .toEqual([Math.round(r), Math.round(g), Math.round(b), opacity])
}

export function rgbStrictEqual(actual, r, g, b, opacity) {
  const equal = actual instanceof Rgb
    && (isNaN(r) ? isNaN(actual.r) /*&& actual.r !== actual.r*/ : actual.r === r)
    && (isNaN(g) ? isNaN(actual.g) /*&& actual.g !== actual.g*/ : actual.g === g)
    && (isNaN(b) ? isNaN(actual.b) /*&& actual.b !== actual.b*/ : actual.b === b)
    && (isNaN(opacity) ? isNaN(actual.opacity) /*&& actual.opacity !== actual.opacity*/ : actual.opacity === opacity);

  expect(equal).toBe(true);
  if (!equal) {
    expect([actual.r, actual.g, actual.b, actual.opacity]).toEqual([r, g, b, opacity]);
  }
}

export function hslEqual(actual, h, s, l, opacity) {

  const equal = actual instanceof Hsl
    && (isNaN(h) ? isNaN(actual.h) /*&& actual.h !== actual.h*/ : h - 1e-6 <= actual.h && actual.h <= h + 1e-6)
    && (isNaN(s) ? isNaN(actual.s) /*&& actual.s !== actual.s*/ : s - 1e-6 <= actual.s && actual.s <= s + 1e-6)
    && (isNaN(l) ? isNaN(actual.l) /*&& actual.l !== actual.l*/ : l - 1e-6 <= actual.l && actual.l <= l + 1e-6)
    && (isNaN(opacity) ? isNaN(actual.opacity) /*&& actual.opacity !== actual.opacity*/ : actual.opacity === opacity);

  expect(equal).toBe(true);

  if (!equal) {
    expect([actual.h, actual.s, actual.l, actual.opacity]).toEqual([h, s, l, opacity]);
  }

}

export function hclEqual(actual, h, c, l, opacity) {

  const equal = actual instanceof Hcl
    && (isNaN(h) ? isNaN(actual.h) /*&& actual.h !== actual.h*/ : h - 1e-6 <= actual.h && actual.h <= h + 1e-6)
    && (isNaN(c) ? isNaN(actual.c) /*&& actual.c !== actual.c*/ : c - 1e-6 <= actual.c && actual.c <= c + 1e-6)
    && (isNaN(l) ? isNaN(actual.l) /*&& actual.l !== actual.l*/ : l - 1e-6 <= actual.l && actual.l <= l + 1e-6)
    && (isNaN(opacity) ? isNaN(actual.opacity) /*&& actual.opacity !== actual.opacity*/ : actual.opacity === opacity);

  expect(equal).toBe(true);

  if (!equal) {
    expect([actual.h, actual.c, actual.l, actual.opacity]).toEqual([h, c, l, opacity]);
  }
}
