import { NgModule } from '@angular/core';
import { TagComponent } from './tag.component';
import { CheckableTagComponent } from './checkable-tag.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 *
 */
@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [TagComponent, CheckableTagComponent],
  exports: [TagComponent, CheckableTagComponent]
})
export class TriTagModule {}
