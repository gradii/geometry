import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triTableDivider]'
})
export class TableDividerDirective {
  @HostBinding(`class.ant-divider`)
  _nzDivider = true;
}
