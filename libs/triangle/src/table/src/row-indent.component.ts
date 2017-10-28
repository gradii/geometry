import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'tri-row-indent',
  template: ``
})
export class RowIndentComponent {
  @Input() indentSize;

  @HostBinding(`style.paddingLeft.px`)
  get paddingLeft() {
    return this.indentSize * 20;
  }

  @HostBinding(`class.ant-table-row-indent`)
  _rowIndent = true;

  constructor() {}
}
