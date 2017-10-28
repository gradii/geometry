import { Directive, TemplateRef, Optional } from '@angular/core';

@Directive({
  selector: '[triGridGroupFooterTemplate]'
})
export class GroupFooterTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
