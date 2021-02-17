/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[triPopConfirm]'
})
export class PopConfirmDirective {
  constructor(public elementRef: ElementRef) {
  }
}
