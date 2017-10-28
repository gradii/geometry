import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckboxDataTableComponent } from './checkbox-data-table.component';
import { TriDataTableModule } from '@gradii/triangle/data-table';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    TriDataTableModule
  ],
  declarations: [CheckboxDataTableComponent],
  exports     : [CheckboxDataTableComponent]
})
export class TriCheckboxDataTableModule {

}