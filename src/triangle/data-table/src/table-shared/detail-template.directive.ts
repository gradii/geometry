/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Input, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triDataTableDetailTemplate], [tri-data-table-detaill-template]',
  exportAs: 'detailTemplate',
})
export class DetailTemplateDirective {

  /**
   * I must declare detail template, even though i not use id
   */
  @Input()
  hackHidden = false;

  @Input()
  showDetailButton = true;

  constructor(@Optional() public templateRef: TemplateRef<any>) {
  }

}
