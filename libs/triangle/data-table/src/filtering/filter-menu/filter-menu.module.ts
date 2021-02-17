import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDatePickerModule } from '@gradii/triangle/datepicker';
import { TriGridModule } from '@gradii/triangle/grid';
import { TriInputModule, TriInputNumberModule, TriRadioModule, TriSelectModule } from '@gradii/triangle/inputs';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterSharedModule } from '../shared/filter-shared.module';
import { FilterMenuContainerComponent } from './filter-menu-container.component';
import { FilterMenuTemplateDirective } from './filter-menu-template.directive';
import { FilterMenuComponent } from './filter-menu.component';
import { BooleanFilterMenuComponent } from './type-filter-menu/boolean-filter-menu.component';
import { DateFilterMenuInputComponent } from './type-filter-menu/date-filter-menu-input.component';
import { DateFilterMenuComponent } from './type-filter-menu/date-filter-menu.component';
import { NumericFilterMenuInputComponent } from './type-filter-menu/numeric-filter-menu-input.component';
import { NumericFilterMenuComponent } from './type-filter-menu/numeric-filter-menu.component';
import { StringFilterMenuComponent } from './type-filter-menu/string-filter-menu.component';

@NgModule({
  imports        : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FilterSharedModule,

    TriSelectModule,
    TriButtonModule,
    TriInputModule,
    TriInputNumberModule,
    TriDatePickerModule,
    TriRadioModule,
    TriCardModule,
    TriGridModule,
    OverlayModule
  ],
  declarations   : [
    FilterMenuComponent,
    FilterMenuContainerComponent,
    StringFilterMenuComponent,
    FilterMenuTemplateDirective,
    NumericFilterMenuComponent,
    NumericFilterMenuInputComponent,
    DateFilterMenuInputComponent,
    DateFilterMenuComponent,
    BooleanFilterMenuComponent
  ],
  exports        : [
    FilterMenuComponent,
    FilterMenuContainerComponent,
    StringFilterMenuComponent,
    FilterMenuTemplateDirective,
    NumericFilterMenuComponent,
    NumericFilterMenuInputComponent,
    DateFilterMenuInputComponent,
    DateFilterMenuComponent,
    BooleanFilterMenuComponent
  ],
  entryComponents: [
    StringFilterMenuComponent,
    NumericFilterMenuComponent,
    DateFilterMenuComponent,
    BooleanFilterMenuComponent
  ]
})
export class FilterMenuModule {}
