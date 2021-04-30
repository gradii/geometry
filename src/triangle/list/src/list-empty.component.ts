import { Component, Input, TemplateRef } from "@angular/core";

@Component({
  selector: 'tri-list-empty',
  template: `
    <tri-embed-empty [componentName]="'list'" [specificContent]="noResult"></tri-embed-empty>
  `
})
export class ListEmptyComponent {
  @Input() noResult?: string | TemplateRef<void>;
}