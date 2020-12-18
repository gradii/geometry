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
import { clamp, create, hex } from './helper';

export class Rgb extends Color {
  private _r;
  private _g;
  private _b;
  private _opacity;

  // @formatter:off
  public get r() { return this._r; }
  public set r(value) { this._r = clamp(value, 0, 255); }

  public get g() { return this._g; }
  public set g(value) { this._g = clamp(value, 0, 255); }

  public get b() { return this._b; }
  public set b(value) { this._b = clamp(value, 0, 255); }

  public get opacity() { return this._opacity; }
  public set opacity(value) { this._opacity = clamp(value, 0, 1); }

  // @formatter:on
  constructor(r?, g?, b?, opacity = 1) {
    super();
    this.r       = r;
    this.g       = g;
    this.b       = b;
    this.opacity = opacity;
  }

  public brighter(k?) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this._r * k, this._g * k, this._b * k, this.opacity);
  }

  public darker(k?) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this._r * k, this._g * k, this._b * k, this.opacity);
  }

  public rgb() {
    return this;
  }

  // public displayable() {
  //   return (0 <= this._r && this._r <= 255)
  //     && (0 <= this._g && this._g <= 255)
  //     && (0 <= this._b && this._b <= 255)
  //     && (0 <= this.opacity && this.opacity <= 1);
  // }

  public hex() {
    return `#${hex(this._r)}${hex(this._g)}${hex(this._b)}`;
  }

  public toString() {
    let a = this.opacity;
    a     = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? 'rgb(' : 'rgba(')
      + Math.max(0, Math.min(255, Math.round(this._r) || 0)) + ', '
      + Math.max(0, Math.min(255, Math.round(this._g) || 0)) + ', '
      + Math.max(0, Math.min(255, Math.round(this._b) || 0))
      + (a === 1 ? ')' : ', ' + a + ')');
  }

  public static create(o): Rgb {
    if (!(o instanceof Color)) {
      o = create(o);
    }
    if (!o) {
      return new Rgb;
    }
    o = o.rgb();
    return new Rgb(o.r, o._g, o.b, o.opacity);
  }
}

export function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

export function rgba(r, g, b, a: number) {
  if (a <= 0) {
    r = g = b = NaN;
  }
  return new Rgb(r, g, b, a);
}

export function rgb(color): Rgb;
export function rgb(r, g, b, a?): Rgb;
export function rgb(r, g?, b?, a?): Rgb {
  if (arguments.length === 1) {
    return Rgb.create(r);
  }
  return new Rgb(r, g, b, a);
}
