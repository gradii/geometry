import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: GreaterFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-gt-operator',
  template: ''
})
export class GreaterFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('gt');
  }
}
