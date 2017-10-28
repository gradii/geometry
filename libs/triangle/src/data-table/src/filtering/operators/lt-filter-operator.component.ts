import { Component } from '@angular/core';
import { FilterOperatorBase } from './filter-operator.base';

@Component({
  providers: [
    {
      provide: FilterOperatorBase,
      useExisting: LessFilterOperatorComponent
    }
  ],
  selector: 'tri-filter-lt-operator',
  template: ''
})
export class LessFilterOperatorComponent extends FilterOperatorBase {
  constructor() {
    super('lt');
  }
}
