import { NgModule } from '@angular/core';
import { DemoIntroGetStartedComponent } from './demo-intro-get-started.component';
import { DemoHighlightModule } from '../share/demo-highlight/demo-highlight.module';
import { DemoMarkdownModule } from '../share/demo-markdown/demo-markdown.module';
import { CommonModule } from '@angular/common';
import { DemoIntroGetStartedRoutingModule } from './demo-intro-get-started.routing.module';

@NgModule({
  imports     : [CommonModule, DemoHighlightModule, DemoIntroGetStartedRoutingModule, DemoMarkdownModule],
  declarations: [DemoIntroGetStartedComponent]
})
export class DemoIntroGetStartedModule {}
