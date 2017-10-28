import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: IsNotNullFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-isnotnull-operator',
  template: ''
})
export class IsNotNullFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('isnotnull');
  }
}
