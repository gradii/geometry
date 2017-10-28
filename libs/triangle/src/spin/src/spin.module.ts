import { NgModule } from '@angular/core';
import { SpinComponent } from './spin.component';
import { CommonModule } from '@angular/common';

@NgModule({
  exports: [SpinComponent],
  declarations: [SpinComponent],
  imports: [CommonModule]
})
export class TriSpinModule {}
