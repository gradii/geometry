/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triTreeViewLoadMoreButtonTemplate]'
})
export class LoadMoreButtonTemplateDirective {
  templateRef: TemplateRef<any>;

  constructor(@Optional() templateRef: TemplateRef<any>) {
    this.templateRef = templateRef;
  }
}
