/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tri-tree-command-template], [triTreeCommandTemplate]'
})
export class TreeCommandTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
