import { Directive, TemplateRef, Optional } from '@angular/core';

@Directive({
  selector: '[triGridCellTemplate], [tri-grid-cell-template]'
})
export class CellTemplateDirective {
  constructor(@Optional() public templateRef: TemplateRef<any>) {}
}
