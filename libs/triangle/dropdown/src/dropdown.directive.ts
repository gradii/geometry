import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[triDropdown], [tri-dropdown], [triDropdownOrigin], [tri-dropdown-origin]'
})
export class DropDownDirective {
  @HostBinding('class.tri-dropdown-trigger') _dropDownTrigger = true;

  constructor(public elementRef: ElementRef) {}
}
