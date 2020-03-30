/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridGroupHeaderTemplate], [tri-grid-group-header-template]'
})
export class GroupHeaderTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {
  }
}
