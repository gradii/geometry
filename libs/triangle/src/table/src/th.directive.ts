import { Directive, Input, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[triTh], [tri-th]'
})
export class ThDirective {
  _el: HTMLElement;
  @Input() width;
  @Input()
  @HostBinding(`class.ant-table-selection-column`)
  checkbox;
  @Input()
  @HostBinding(`class.ant-table-expand-icon-th`)
  expand;

  constructor(private _elementRef: ElementRef) {
    this._el = this._elementRef.nativeElement;
  }
}
