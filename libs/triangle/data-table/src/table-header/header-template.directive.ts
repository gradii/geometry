import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridHeaderTemplate], [tri-grid-header-template]'
})
export class HeaderTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
