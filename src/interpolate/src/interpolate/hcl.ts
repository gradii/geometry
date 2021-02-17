/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Hcl } from '@gradii/color';
import { InterpolateColor } from './color';
import { InterpolateHue } from './hue';

export class InterpolateHcl {
  public h: any;
  public c: any;
  public l: any;
  public opacity: any;

  public interpolate(start, end) {
    const _start = Hcl.create(start);
    const _end   = Hcl.create(end);
    this.h       = new InterpolateHue().interpolate(_start.h, _end.h);
    this.c       = new InterpolateColor().interpolate(_start.c, _end.c);
    this.l       = new InterpolateColor().interpolate(_start.l, _end.l);
    this.opacity = new InterpolateColor().interpolate(_start.opacity, _end.opacity);
    return this;
  }

  public getResult(t) {
    return new Hcl(
      this.h.getResult(t),
      this.c.getResult(t),
      this.l.getResult(t),
      this.opacity.getResult(t)
    );
  }
}

export class InterpolateHclLong extends InterpolateHcl {
  public interpolate(start: string, end: string) {
    const _start = Hcl.create(start);
    const _end   = Hcl.create(end);
    this.h       = new InterpolateColor().interpolate(_start.h, _end.h);
    this.c       = new InterpolateColor().interpolate(_start.c, _end.c);
    this.l       = new InterpolateColor().interpolate(_start.l, _end.l);
    this.opacity = new InterpolateColor().interpolate(_start.opacity, _end.opacity);
    return this;
  }
}
