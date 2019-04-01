import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triTbodyTr]'
})
export class TbodyTrDirective {
  @HostBinding(`class.tri-table-row`)
  _nzTableRow = true;
}
