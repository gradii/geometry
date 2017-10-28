import { Directive, HostBinding } from '@angular/core';
@Directive({
  selector: '[triThead]'
})
export class TheadDirective {
  @HostBinding(`class.ant-table-thead`)
  _tableThead = true;

  constructor() {}
}
