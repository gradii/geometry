import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[triTh], [tri-th]'
})
export class ThDirective {
  _el: HTMLElement;
  @Input() width;
  @Input()
  @HostBinding(`class.tri-table-selection-column`)
  checkbox;
  @Input()
  @HostBinding(`class.tri-table-expand-icon-th`)
  expand;

  constructor(private _elementRef: ElementRef) {
    this._el = this._elementRef.nativeElement;
  }
}
