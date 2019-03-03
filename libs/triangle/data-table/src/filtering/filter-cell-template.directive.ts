import { Directive, TemplateRef, Optional } from '@angular/core';

@Directive({
  selector: '[triGridFilterCellTemplate]'
})
export class FilterCellTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
