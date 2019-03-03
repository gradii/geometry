import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[triTabLabel]'
})
export class TabLabelDirective {
  @HostBinding('class.tri-tabs-tab') _nzTabsTab = true;

  @Input()
  @HostBinding('class.tri-tabs-tab-disabled')
  disabled = false;

  constructor(public elementRef: ElementRef) {}

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }

  getOffsetTop(): number {
    return this.elementRef.nativeElement.offsetTop;
  }

  getOffsetHeight(): number {
    return this.elementRef.nativeElement.offsetHeight;
  }
}
