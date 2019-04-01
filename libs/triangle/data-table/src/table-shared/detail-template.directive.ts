import { Directive, Input, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triDataTableDetailTemplate], [tri-data-table-detaill-template]',
  exportAs: 'detailTemplate',
})
export class DetailTemplateDirective {

  /**
   * I must declare detail template, even though i not use id
   * @type {boolean}
   */
  @Input()
  hackHidden = false;

  @Input()
  showDetailButton = true;

  constructor(@Optional() public templateRef: TemplateRef<any>) {
  }

}
