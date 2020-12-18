/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { interpolateNumber } from '../../public-api';

let reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, 'g');

export class InterpolateString {
  private s;
  private q;
  private a;
  private b;

  public interpolate(a: string, b: string) {
    let bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) {
          s[i] += bs;
        } else { // coalesce with previous string
          s[++i] = bs;
        }
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) {
          s[i] += bm;
        } else { // coalesce with previous string
          s[++i] = bm;
        }
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i, x: interpolateNumber(+am, +bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) {
        s[i] += bs;
      } else { // coalesce with previous string
        s[++i] = bs;
      }
    }

    this.s = s;
    this.q = q;
    this.a = a;
    this.b = b;

    return this;
  }

  public getResult(t) {
    if (this.s.length < 2) {
      return this.q[0] ? `${this.q[0].x(t)}` : this.b;
    }
    for (let o of this.q) {
      this.s[o.i] = o.x(t);
    }
    return this.s.join('');
  }
}
