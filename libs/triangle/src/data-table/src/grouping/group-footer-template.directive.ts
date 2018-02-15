import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridGroupFooterTemplate]'
})
export class GroupFooterTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
