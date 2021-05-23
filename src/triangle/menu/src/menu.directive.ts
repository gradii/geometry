/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: 'menuItemNodeDef'
})
export class MenuItemNodeDefDirective {
  constructor(private _templateRef: TemplateRef<any>) {
  }
}
