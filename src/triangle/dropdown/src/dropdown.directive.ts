/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[triDropdown], [tri-dropdown], [triDropdownOrigin], [tri-dropdown-origin]'
})
export class DropDownDirective {
  @HostBinding('class.tri-dropdown-trigger') _dropDownTrigger = true;

  constructor(public elementRef: ElementRef) {}
}
