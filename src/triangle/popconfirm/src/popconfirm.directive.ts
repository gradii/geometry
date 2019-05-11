import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[triPopConfirm]'
})
export class PopConfirmDirective {
  constructor(public elementRef: ElementRef) {}
}
