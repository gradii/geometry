/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[tri-tooltip], [triTooltip]'
})
export class TooltipDirective {
  @HostBinding('class.tri-tooltip-open') isTooltipOpen: boolean;

  constructor(public elementRef: ElementRef) {
  }
}
