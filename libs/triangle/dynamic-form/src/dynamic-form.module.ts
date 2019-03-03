import { TriDataTableModule } from '@gradii/triangle/data-table';
import { TriFormModule } from '@gradii/triangle/form';
import { TriGridModule } from '@gradii/triangle/grid';
import { TriCheckboxDataTableModule, TriRangeInputModule } from '@gradii/triangle/input-compose';
import { TriCheckboxModule, TriInputModule, TriInputNumberModule, TriRadioModule, TriSelectModule } from '@gradii/triangle/inputs';
import { TriToolTipModule } from '@gradii/triangle/tooltip';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormFactoryComponent } from './dynamic-form-factory.component';

/**
 * the TriDynamicFormModule should be be imported by TriDynamicFormModule.exports()
 */
@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TriInputModule,
    TriInputNumberModule,
    TriCheckboxModule,
    TriSelectModule,
    TriRadioModule,
    TriRangeInputModule,
    TriToolTipModule,

    TriGridModule,
    TriDataTableModule,
    TriCheckboxDataTableModule,

    TriFormModule
  ],
  declarations: [DynamicFormFactoryComponent],
  exports     : [DynamicFormFactoryComponent]
})
export class TriDynamicFormModule {
  public static exports() {
    return [DynamicFormFactoryComponent];
  }
}
