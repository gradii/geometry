import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriDataTableModule } from '@gradii/triangle/data-table';
import { CheckboxDataTableComponent } from './checkbox-data-table.component';

@NgModule({
  imports     : [CommonModule, FormsModule, TriDataTableModule],
  declarations: [CheckboxDataTableComponent],
  exports     : [CheckboxDataTableComponent]
})
export class TriCheckboxDataTableModule {}
