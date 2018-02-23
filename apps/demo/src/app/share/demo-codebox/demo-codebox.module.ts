import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriangleModule } from '@gradii/triangle-examples';
import { DemoCodeBoxComponent } from './demo-codebox.component';
import { DemoHighlightModule } from '../demo-highlight/demo-highlight.module';

@NgModule({
  imports     : [CommonModule, DemoHighlightModule, TriangleModule],
  declarations: [DemoCodeBoxComponent],
  exports     : [DemoCodeBoxComponent]
})
export class DemoCodeBoxModule {}
