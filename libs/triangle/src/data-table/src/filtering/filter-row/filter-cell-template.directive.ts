import { Directive, Optional, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridFilterCellTemplate]'
})
export class FilterCellTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
