import { Directive, TemplateRef, Optional } from '@angular/core';

@Directive({
  selector: '[triGridGroupHeaderTemplate], [tri-grid-group-header-template]'
})
export class GroupHeaderTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
