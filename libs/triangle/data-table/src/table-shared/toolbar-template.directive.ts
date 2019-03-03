import { Directive, Input, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridToolbarTemplate], [tri-grid-toolbar-template]'
})
export class ToolbarTemplateDirective {
  _position: 'top' | 'bottom' | 'both';

  constructor(@Optional() public templateRef: TemplateRef<any>) {
    this._position = 'top';
  }

  @Input()
  get position() {
    return this._position;
  }

  set position(position) {
    this._position = position;
  }
}
