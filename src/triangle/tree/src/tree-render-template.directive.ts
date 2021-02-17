/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: '[tri-tree-render-template], [triTreeRenderTemplate]'
})
export class TreeRenderTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
