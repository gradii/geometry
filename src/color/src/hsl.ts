/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

// tslint:disable triple-equals
import { Color } from './color';
import { brighter, darker } from './const';
import { create } from './helper';
import { Rgb } from './rgb';

function hsl2rgb(h, m1, m2) {
  return (h < 60
      ? m1 + (m2 - m1) * h / 60
      : h < 180
        ? m2
        : h < 240
          ? m1 + (m2 - m1) * (240 - h) / 60
          : m1
  ) * 255;
}

export class Hsl extends Color {
  constructor(public h?: number, public s?: number, public l?: number,
              public opacity: number = 1) {
    super();
  }

  public brighter(k?) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  }

  public darker(k?) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  }

  public rgb() {
    let h  = this.h % 360 + (this.h < 0 ? 360 : 0),
        s  = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l  = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  }

  public displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
      && (0 <= this.l && this.l <= 1)
      && (0 <= this.opacity && this.opacity <= 1);
  }

  public static create(o): Hsl {
    if (o instanceof Hsl) {
      return new Hsl(o.h, o.s, o.l, o.opacity);
    }
    if (!(o instanceof Color)) {
      o = create(o);
    }
    if (!o) {
      return new Hsl;
    }
    if (o instanceof Hsl) {
      return o;
    }
    if (o instanceof Color) { o = o.rgb()}
    let r   = o.r / 255,
        g   = o.g / 255,
        b   = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h   = NaN,
        s   = max - min,
        l   = (max + min) / 2;
    if (s) {
      if (r === max) {
        h = (g - b) / s + (g < b ? 6 : 0);
      } else if (g === max) {
        h = (b - r) / s + 2;
      } else {
        h = (r - g) / s + 4;
      }
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

}

/**
 * @param h
 * @param s
 * @param l
 * @param a
 *
 * @internal
 */
export function hsla(h: number, s: number, l: number, a: number) {
  if (a <= 0) {
    h = s = l = NaN;
  } else if (l <= 0 || l >= 1) {
    h = s = NaN;
  } else if (s <= 0) {
    h = NaN;
  }
  return new Hsl(h, s, l, a);
}

export function hsl(color): Hsl ;
export function hsl(h: number, s: number, l: number, a?: number): Hsl ;
export function hsl(h: number, s?: number, l?: number, a?: number): Hsl {
  if (arguments.length === 1) {
    return Hsl.create(h);
  }
  return new Hsl(h, s, l, a)
}
