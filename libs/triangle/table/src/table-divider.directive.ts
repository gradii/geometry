import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triTableDivider]'
})
export class TableDividerDirective {
  @HostBinding(`class.tri-divider`)
  _nzDivider = true;
}
