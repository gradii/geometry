/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[triPopover], [tri-popover], [triPopoverOrigin], [tri-popover-origin]'
})
export class PopoverDirective {
  constructor(public elementRef: ElementRef) {
  }
}
