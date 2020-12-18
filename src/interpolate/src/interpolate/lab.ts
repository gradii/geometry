/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Lab } from '@gradii/color';
import { InterpolateColor } from './color';

export class InterpolateLab {
  public l: InterpolateColor;
  public a: InterpolateColor;
  public b: InterpolateColor;
  public opacity: InterpolateColor;

  public interpolate(start: string, end: string) {
    const _start = Lab.create(start);
    const _end   = Lab.create(end);

    this.l       = new InterpolateColor().interpolate(_start.l, _end.l);
    this.a       = new InterpolateColor().interpolate(_start.a, _end.a);
    this.b       = new InterpolateColor().interpolate(_start.b, _end.b);
    this.opacity = new InterpolateColor().interpolate(_start.opacity, _end.opacity);
    return this;
  }

  public getResult(t) {
    return new Lab(
      this.l.getResult(t),
      this.a.getResult(t),
      this.b.getResult(t),
      this.opacity.getResult(t)
    );
  }
}
