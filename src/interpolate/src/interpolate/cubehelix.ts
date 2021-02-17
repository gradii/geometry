/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Cubehelix } from '@gradii/color';
import { InterpolateColor } from './color';
import { InterpolateHue } from './hue';

export class InterpolateCubehelix {
  public h: any;
  public s: any;
  public l: any;
  public opacity: any;

  constructor(public gamma = 1) {
  }

  public interpolate(start: string, end: string) {
    const _start = Cubehelix.create(start);
    const _end   = Cubehelix.create(end);

    this.h       = new InterpolateHue().interpolate(_start.h, _end.h);
    this.s       = new InterpolateColor().interpolate(_start.s, _end.s);
    this.l       = new InterpolateColor().interpolate(_start.l, _end.l);
    this.opacity = new InterpolateColor().interpolate(_start.opacity, _end.opacity);
    return this;
  }

  public getResult(t) {
    return new Cubehelix(
      this.h.getResult(t),
      this.s.getResult(t),
      this.l.getResult(Math.pow(t, this.gamma)),
      this.opacity.getResult(t)
    );
  }
}

export class InterpolateCubehelixLong extends InterpolateCubehelix {
  constructor(gamma?) {
    super(gamma);
  }

  public interpolate(start: string, end: string) {
    const _start = Cubehelix.create(start);
    const _end   = Cubehelix.create(end);

    this.h       = new InterpolateColor().interpolate(_start.h, _end.h);
    this.s       = new InterpolateColor().interpolate(_start.s, _end.s);
    this.l       = new InterpolateColor().interpolate(_start.l, _end.l);
    this.opacity = new InterpolateColor().interpolate(_start.opacity, _end.opacity);
    return this;
  }

}
