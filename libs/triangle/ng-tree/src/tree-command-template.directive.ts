import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tri-tree-command-template], [triTreeCommandTemplate]'
})
export class TreeCommandTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}