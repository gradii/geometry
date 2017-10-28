import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TriFormModule } from '@gradii/triangle/form';
import {
  TriCheckboxModule, TriInputModule, TriInputNumberModule, TriRadioModule,
  TriSelectModule
} from '@gradii/triangle/inputs';
import { TriGridModule } from '@gradii/triangle/grid';
import { DynamicFormFactoryComponent } from './dynamic-form-factory.component';
import { TriDataTableModule } from '@gradii/triangle/data-table';
import { TriCheckboxDataTableModule } from '@gradii/triangle/input-compose';
import { TriToolTipModule } from '@gradii/triangle/tooltip';
import { TriRangeInputModule } from '@gradii/triangle/input-compose/src/range-input/range-input.module';


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

    TriFormModule,

  ],
  declarations: [
    DynamicFormFactoryComponent
  ],
  exports     : [
    DynamicFormFactoryComponent
  ],
})
export class TriDynamicFormModule {
  public static exports() {
    return [
      DynamicFormFactoryComponent
    ];
  }
}