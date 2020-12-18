/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */
import { interpolateZoom } from '../src/wrapper/interpolate-zoom';

describe('test interpolate zoom', () => {
  it('interpolateZoom(a, b) handles nearly-coincident points', () => {
    expect(interpolateZoom(
      [324.68721096803614, 59.43501602433761, 1.8827137399562621],
      [324.6872108946794, 59.43501601062763, 7.399052110984391])(0.5)
    ).toEqual([324.68721093135775, 59.43501601748262, 3.7323313186268305]);
  });
});
