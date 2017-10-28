import { NgModule } from '@angular/core';
import { DemoIntroChangelogComponent } from './demo-intro-changelog.component';
import { DemoHighlightModule } from '../share/demo-highlight/demo-highlight.module';
import { DemoMarkdownModule } from '../share/demo-markdown/demo-markdown.module';
import { CommonModule } from '@angular/common';
import { DemoIntroChangeLogRoutingModule } from './demo-intro-changelog.routing.module';

@NgModule({
  imports: [CommonModule, DemoHighlightModule, DemoIntroChangeLogRoutingModule, DemoMarkdownModule],
  declarations: [DemoIntroChangelogComponent]
})
export class DemoIntroChangeLogModule {}
