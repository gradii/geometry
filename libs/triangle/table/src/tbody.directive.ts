import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triTbody]'
})
export class TbodyDirective {
  @HostBinding(`class.tri-table-tbody`)
  _nzTableTbody = true;
}
