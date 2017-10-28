import { Directive, ElementRef } from '@angular/core';
@Directive({
  selector: '[triPopover]'
})
export class PopoverDirective {
  constructor(public elementRef: ElementRef) {}
}
