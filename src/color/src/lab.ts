/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import { Color } from './color';
import { deg2rad } from './common';
import { Hcl } from './hcl';
import { Rgb } from './rgb';

const K  = 18,
      t0 = 16 / 116,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;

function gray(l, opacity) {
  return new Lab(l, 0, 0, opacity === null ? 1 : opacity);
}

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

export class Lab extends Color {
  //@formatter:on
  constructor(public l, public a, public b, public opacity = 1) {
    super();
  }

  public brighter(k = 1) {
    return new Lab(this.l + K * k, this.a, this.b, this.opacity);
  }

  public darker(k = 1) {
    return new Lab(this.l - K * k, this.a, this.b, this.opacity);
  }

  public rgb(): Rgb {
    let y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    // use D50
    // x     = 0.96422 * lab2xyz(x);
    // y     = 1 * lab2xyz(y);
    // z     = 0.82521 * lab2xyz(z);
    // return new Rgb(
    //   lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
    //   lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
    //   lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
    // );
    // use D65
    x = 0.95047 * lab2xyz(x);
    y = 1.00000 * lab2xyz(y);
    z = 1.08883 * lab2xyz(z);
    return new Rgb(
      lrgb2rgb( 3.2406 * x - 1.5372 * y - 0.4986 * z),
      lrgb2rgb(-0.9689 * x + 1.8758 * y + 0.0415 * z),
      lrgb2rgb( 0.0557 * x - 0.2040 * y + 1.0570 * z),
      this.opacity
    );
  }

  public static create(o: Lab | Hcl | Rgb | Color | string) {
    if (o instanceof Lab) { return new Lab(o.l, o.a, o.b, o.opacity); }
    if (o instanceof Hcl) {
      if (isNaN(o.h)) { return new Lab(o.l, 0, 0, o.opacity); }
      let h = o.h * deg2rad;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (o instanceof Color) { o = o.rgb()}
    if (!(o instanceof Rgb)) { o = Rgb.create(o); }
    // let r = rgb2lrgb((o as Rgb).r),
    //     g = rgb2lrgb((o as Rgb).g),
    //     b = rgb2lrgb((o as Rgb).b),
    //     y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / 1.00000), x, z; // D50
    // if (r === g && g === b) { x = z = y; } else {
    //   x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / 0.96422);
    //   z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / 0.82521);
    // }
    let r = rgb2lrgb((o as Rgb).r),
        g = rgb2lrgb((o as Rgb).g),
        b = rgb2lrgb((o as Rgb).b),
        y = xyz2lab((0.2126 * r + 0.7152 * g + 0.0722 * b) / 1.00000), x, z; // D65
    if (r === g && g === b) { x = z = y; } else {
      x = xyz2lab((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
      z = xyz2lab((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
    }
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), (o as Rgb).opacity);
  }
}

export function lab(color): Lab;
export function lab(l, a, b, o?): Lab;
export function lab(l, a?, b?, o?): Lab {
  if (arguments.length === 1) {
    return Lab.create(l);
  }
  return new Lab(l, a, b, o);
}
