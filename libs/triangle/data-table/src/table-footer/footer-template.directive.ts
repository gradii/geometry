/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridFooterTemplate], [tri-grid-footer-template]'
})
export class FooterTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {
  }
}
