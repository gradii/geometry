import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triDataTableFilterMenuTemplate]'
})
export class FilterMenuTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
