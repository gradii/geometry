/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridFilterCellTemplate]'
})
export class FilterCellTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {
  }
}
