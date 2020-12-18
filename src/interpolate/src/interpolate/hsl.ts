/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Hsl } from '@gradii/color';
import { InterpolateColor } from './color';
import { InterpolateHue } from './hue';

export class InterpolateHsl {
  public h: any;
  public s: any;
  public l: any;
  public opacity: any;

  public interpolate(start, end) {
    const _start = Hsl.create(start);
    const _end   = Hsl.create(end);

    this.h       = new InterpolateHue().interpolate(_start.h, _end.h);
    this.s       = new InterpolateColor().interpolate(_start.s, _end.s);
    this.l       = new InterpolateColor().interpolate(_start.l, _end.l);
    this.opacity = new InterpolateColor().interpolate(_start.opacity, _end.opacity);
    return this;
  }

  public getResult(t) {
    return new Hsl(
      this.h.getResult(t),
      this.s.getResult(t),
      this.l.getResult(t),
      this.opacity.getResult(t)
    );
  }
}

export class InterpolateHslLong extends InterpolateHsl {
  public interpolate(start, end) {
    const _start = Hsl.create(start);
    const _end   = Hsl.create(end);

    this.h       = new InterpolateColor().interpolate(_start.h, _end.h);
    this.s       = new InterpolateColor().interpolate(_start.s, _end.s);
    this.l       = new InterpolateColor().interpolate(_start.l, _end.l);
    this.opacity = new InterpolateColor().interpolate(_start.opacity, _end.opacity);
    return this;
  }
}
