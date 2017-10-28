import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoMarkdownComponent } from './demo-markdown.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DemoMarkdownComponent],
  exports: [DemoMarkdownComponent]
})
export class DemoMarkdownModule {}
