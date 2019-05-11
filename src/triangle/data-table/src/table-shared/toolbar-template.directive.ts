import { Directive, Input, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triDataTableToolbarTemplate], [tri-data-table-toolbar-template]'
})
export class ToolbarTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {
    this._position = 'top';
  }

  _position: 'top' | 'bottom' | 'both';

  @Input()
  get position() {
    return this._position;
  }

  set position(position) {
    this._position = position;
  }
}
