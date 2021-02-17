/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {Directive, ElementRef, HostBinding, Input, NgZone, Renderer2} from '@angular/core';

export type TabPositionMode = 'horizontal' | 'vertical';

@Directive({
  selector: '[triTabsInkBar]'
})
export class TabsInkBarDirective {
  @HostBinding('class.tri-tabs-ink-bar')
  _nzTabsInkBar = true;

  @Input()
  @HostBinding('class.tri-tabs-ink-bar-animated')
  animated: boolean;

  @Input() positionMode: TabPositionMode = 'horizontal';

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef, private _ngZone: NgZone) {
  }

  alignToElement(element: HTMLElement) {
    this.show();

    this._ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        // when horizontal remove height style and add transfrom left
        if (this.positionMode === 'horizontal') {
          this._renderer.removeStyle(this._elementRef.nativeElement, 'height');
          this._renderer.setStyle(
            this._elementRef.nativeElement,
            'transform',
            `translate3d(${this._getLeftPosition(element)}, 0px, 0px)`
          );
          this._renderer.setStyle(this._elementRef.nativeElement, 'width', this._getElementWidth(element));
        } else {
          // when vertical remove width style and add transfrom top
          this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
          this._renderer.setStyle(
            this._elementRef.nativeElement,
            'transform',
            `translate3d(0px, ${this._getTopPosition(element)}, 0px)`
          );
          this._renderer.setStyle(this._elementRef.nativeElement, 'height', this._getElementHeight(element));
        }
      });
    });
  }

  show(): void {
    this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'visible');
  }

  setDisplay(value: any): void {
    this._renderer.setStyle(this._elementRef.nativeElement, 'display', value);
  }

  hide(): void {
    this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
  }

  _getLeftPosition(element: HTMLElement): string {
    return element ? element.offsetLeft + 'px' : '0';
  }

  _getElementWidth(element: HTMLElement): string {
    return element ? element.offsetWidth + 'px' : '0';
  }

  _getTopPosition(element: HTMLElement): string {
    return element ? element.offsetTop + 'px' : '0';
  }

  _getElementHeight(element: HTMLElement): string {
    return element ? element.offsetHeight + 'px' : '0';
  }
}
