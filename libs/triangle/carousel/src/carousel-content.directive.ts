/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[triCarouselContent]'
})
export class CarouselContentDirective {
  width        = 0;
  isActive     = false;
  left: number = null;
  top: number  = null;
  fadeMode     = false;
  nativeElement: HTMLElement;

  @HostBinding('class.slick-slide') _nzSlickSlide = true;

  constructor(private _el: ElementRef) {
    this.nativeElement = this._el.nativeElement;
  }

  @HostBinding('class.slick-active')
  get setActiveClass() {
    return this.isActive === true;
  }

  @HostBinding('style.width.px')
  get setWidth() {
    return this.width;
  }

  @HostBinding('style.left.px')
  get setLeft() {
    return this.left;
  }

  @HostBinding('style.top.px')
  get setTop() {
    return this.top;
  }

  @HostBinding('style.position')
  get setPosition() {
    if (this.fadeMode) {
      return 'relative';
    }
    return null;
  }

  @HostBinding('style.opacity')
  get setOpacity() {
    if (this.fadeMode) {
      return this.isActive ? 1 : 0;
    }
    return null;
  }
}
