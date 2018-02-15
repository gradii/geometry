import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[triTd], [tri-td]'
})
export class TdDirective {
  _el: HTMLElement;
  @Input()
  @HostBinding(`class.ant-table-selection-column`)
  checkbox;
  @Input()
  @HostBinding(`class.ant-table-row-expand-icon-cell`)
  expand;

  constructor(private _elementRef: ElementRef) {
    this._el = this._elementRef.nativeElement;
  }
}
