import { Component, Input } from '@angular/core';

@Component({
  selector: 'tri-data-table-filter-simple',
  template: `

  `
})
export class FilterSimpleComponent {
  logicOperators: Array<{ label: string; value: 'and' | 'or' }>;

  @Input() column;

  @Input() filter;

  constructor() {}
}
