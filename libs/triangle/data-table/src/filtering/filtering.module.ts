import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TriDatePickerModule } from '@gradii/triangle/datepicker';
import { TriDropDownModule } from '@gradii/triangle/dropdown';
import { TriInputModule } from '@gradii/triangle/inputs';
import { TriInputNumberModule } from '@gradii/triangle/inputs';
import { AutoCompleteFilterCellComponent } from './autocomplete-filter-cell.component';
import { BooleanFilterCellComponent } from './boolean-filter-cell.component';
import { DateFilterCellComponent } from './date-filter-cell.component';
import { FilterCellOperatorsComponent } from './filter-cell-operators.component';
import { FilterCellTemplateDirective } from './filter-cell-template.directive';
import { FilterCellWrapperComponent } from './filter-cell-wrapper.component';
import { FilterCellComponent } from './filter-cell.component';
import { FilterHostDirective } from './filter-host.directive';
import { FilterInputDirective } from './filter-input.directive';
import { FilterRowComponent } from './filter-row.component';
import { NumericFilterCellComponent } from './numeric-filter-cell.component';
import { ContainsFilterOperatorComponent } from './operators/contains-filter-operator.component';
import { EndsWithFilterOperatorComponent } from './operators/ends-with-filter-operator.component';
import { EqualFilterOperatorComponent } from './operators/eq-filter-operator.component';
import { GreaterFilterOperatorComponent } from './operators/gt-filter-operator.component';
import { GreaterOrEqualToFilterOperatorComponent } from './operators/gte-filter-operator.component';
import { IsEmptyFilterOperatorComponent } from './operators/is-empty-filter-operator.component';
import { IsNotEmptyFilterOperatorComponent } from './operators/is-not-empty-filter-operator.component';
import { IsNotNullFilterOperatorComponent } from './operators/is-not-null-filter-operator.component';
import { IsNullFilterOperatorComponent } from './operators/isnull-filter-operator.component';
import { LessFilterOperatorComponent } from './operators/lt-filter-operator.component';
import { LessOrEqualToFilterOperatorComponent } from './operators/lte-filter-operator.component';
import { NotEqualFilterOperatorComponent } from './operators/neq-filter-operator.component';
import { DoesNotContainFilterOperatorComponent } from './operators/not-contains-filter-operator.component';
import { StartsWithFilterOperatorComponent } from './operators/starts-with-filter-operator.component';
import { StringFilterCellComponent } from './string-filter-cell.component';
const FILTER_OPERATORS: any[] = [
  FilterCellOperatorsComponent,
  ContainsFilterOperatorComponent,
  DoesNotContainFilterOperatorComponent,
  EndsWithFilterOperatorComponent,
  EqualFilterOperatorComponent,
  IsEmptyFilterOperatorComponent,
  IsNotEmptyFilterOperatorComponent,
  IsNotNullFilterOperatorComponent,
  IsNullFilterOperatorComponent,
  NotEqualFilterOperatorComponent,
  StartsWithFilterOperatorComponent,
  GreaterFilterOperatorComponent,
  GreaterOrEqualToFilterOperatorComponent,
  LessFilterOperatorComponent,
  LessOrEqualToFilterOperatorComponent
];
const INTERNAL_COMPONENTS = [
  FilterRowComponent,
  FilterCellComponent,
  FilterCellTemplateDirective,
  FilterCellOperatorsComponent,
  StringFilterCellComponent,
  NumericFilterCellComponent,
  AutoCompleteFilterCellComponent,
  BooleanFilterCellComponent,
  FilterHostDirective,
  FilterCellWrapperComponent,
  FilterInputDirective,
  DateFilterCellComponent
];
const importedModules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  TriDropDownModule,
  // AutoCompleteModule,
  TriInputModule,
  TriInputNumberModule,
  TriDatePickerModule
];
const ENTRY_COMPONENTS = [
  StringFilterCellComponent,
  NumericFilterCellComponent,
  BooleanFilterCellComponent,
  DateFilterCellComponent
];
@NgModule({
  declarations: [INTERNAL_COMPONENTS, FILTER_OPERATORS],
  entryComponents: ENTRY_COMPONENTS,
  exports: [INTERNAL_COMPONENTS, FILTER_OPERATORS],
  imports: [importedModules]
})
export class RowFilterModule {
  static exports() {
    return [
      FilterRowComponent,
      FilterCellComponent,
      FilterCellTemplateDirective,
      FilterCellOperatorsComponent,
      StringFilterCellComponent,
      NumericFilterCellComponent,
      AutoCompleteFilterCellComponent,
      BooleanFilterCellComponent,
      DateFilterCellComponent,
      ...FILTER_OPERATORS
    ];
  }
}
