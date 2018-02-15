import { TriButtonModule } from '@gradii/triangle/button';
import { TriFormModule } from '@gradii/triangle/form';
import { TriInputModule } from '@gradii/triangle/inputs';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RangeInputComponent } from './range-input.component';

/**
 */
@NgModule({
  imports     : [CommonModule, FormsModule, TriFormModule, TriInputModule, TriButtonModule],
  declarations: [RangeInputComponent],
  exports     : [RangeInputComponent]
})
export class TriRangeInputModule {}
