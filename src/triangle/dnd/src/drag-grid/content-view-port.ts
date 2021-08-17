/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export class ContentViewPort {
  left: number = 0;
  top: number  = 0;

  width: number  = 0;
  height: number = 0;

  // scaleAt: {
  //   x: number,
  //   y: number,
  //   alpha: number,
  // };

  contentPixelXtoViewport(x: number) {
    return this.left + x;
  }

  viewportPixelXToContent(x: number) {
    return x - this.left;
  }

  contentPixelYtoViewport(y: number) {
    return this.top + y;
  }

  viewportPixelYToContent(y: number) {
    return y - this.top;
  }
  
}
