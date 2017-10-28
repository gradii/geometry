import { NgModule } from '@angular/core';
import { DemoIntroComponent } from './demo-intro.component';
import { DemoHighlightModule } from '../share/demo-highlight/demo-highlight.module';
import { DemoMarkdownModule } from '../share/demo-markdown/demo-markdown.module';
import { CommonModule } from '@angular/common';
import { DemoIntroRoutingModule } from './demo-intro.routing.module';

@NgModule({
  imports: [CommonModule, DemoHighlightModule, DemoIntroRoutingModule, DemoMarkdownModule],
  declarations: [DemoIntroComponent]
})
export class DemoIntroModule {}
