import { NgModule } from '@angular/core';
import { RangeInputComponent } from './range-input.component';
import { CommonModule } from '@angular/common';
import { TriInputModule } from '@gradii/triangle/inputs';
import { FormsModule } from '@angular/forms';
import { TriFormModule } from '@gradii/triangle/form';
import { TriButtonModule } from '@gradii/triangle/button';

/**
 */
@NgModule({
  imports     : [CommonModule, FormsModule, TriFormModule, TriInputModule, TriButtonModule],
  declarations: [RangeInputComponent],
  exports     : [RangeInputComponent]
})
export class TriRangeInputModule {}