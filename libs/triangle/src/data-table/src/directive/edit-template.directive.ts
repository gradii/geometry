import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[triGridEditTemplate], [tri-grid-edit-template]'
})
export class EditTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
