import { Directive, TemplateRef, Optional } from '@angular/core';

@Directive({
  selector: '[triGridNoRecordsTemplate], [tri-grid-no-records-template]'
})
export class NoRecordsTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
