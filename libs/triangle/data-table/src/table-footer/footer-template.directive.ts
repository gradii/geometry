import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridFooterTemplate], [tri-grid-footer-template]'
})
export class FooterTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
