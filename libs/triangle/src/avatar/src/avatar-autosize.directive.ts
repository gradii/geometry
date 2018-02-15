import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[triAvatarAutosize]'
})
export class AvatarAutosizeDirective implements OnChanges {
  _el: any;

  @Input() avatarBoundingClientRect: any;

  @Input() enable: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if ('avatarBoundingClientRect' in changes) {
      if (
        changes['avatarBoundingClientRect'].currentValue.height !==
        changes['avatarBoundingClientRect'].previousValue.height ||
        changes['avatarBoundingClientRect'].currentValue.width !==
        changes['avatarBoundingClientRect'].previousValue.width
      ) {
        this._calcSize();
      }
    } else {
      this._calcSize();
    }
  }

  constructor(_elementRef: ElementRef, private renderer: Renderer2) {
    this._el = _elementRef.nativeElement;
  }

  private _calcSize() {
    if (!this.enable || !this.avatarBoundingClientRect) {
      return;
    }

    const childrenWidth = this._el.offsetWidth;
    const childrenHeight = this._el.offsetHeight;
    const avatarWidth = this.avatarBoundingClientRect.width;
    const avatarHeight = this.avatarBoundingClientRect.height;
    const widthScale = avatarWidth - 8 < childrenWidth ? (avatarWidth - 8) / childrenWidth : 1;
    const heightScale = avatarHeight - 8 < childrenHeight ? (avatarHeight - 8) / childrenHeight : 1;
    const scale = Math.min(heightScale, widthScale);

    if (scale === 1) {
      this.renderer.removeStyle(this._el, 'transform');
      this.renderer.removeStyle(this._el, 'position');
      this.renderer.removeStyle(this._el, 'display');
      this.renderer.removeStyle(this._el, 'left');
    } else {
      this.renderer.setStyle(this._el, 'transform', `scale(${scale})`);
      this.renderer.setStyle(this._el, 'position', 'absolute');
      this.renderer.setStyle(this._el, 'display', 'inline-block');
      this.renderer.setStyle(this._el, 'left', `calc(50% - ${Math.round(childrenWidth / 2)}px)`);
    }
  }
}
