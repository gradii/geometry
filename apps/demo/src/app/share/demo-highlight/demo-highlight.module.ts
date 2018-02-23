import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoHighlightComponent } from './demo-highlight.component';

@NgModule({
  imports     : [CommonModule],
  declarations: [DemoHighlightComponent],
  exports     : [DemoHighlightComponent]
})
export class DemoHighlightModule {}
