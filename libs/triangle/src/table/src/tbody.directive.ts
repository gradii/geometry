import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triTbody]'
})
export class TbodyDirective {
  @HostBinding(`class.ant-table-tbody`)
  _nzTableTbody = true;
}
