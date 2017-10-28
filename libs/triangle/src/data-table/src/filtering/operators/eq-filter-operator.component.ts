import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: EqualFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-eq-operator',
  template: ''
})
export class EqualFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('eq');
  }
}
