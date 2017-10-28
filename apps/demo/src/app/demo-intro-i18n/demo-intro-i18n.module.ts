import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoMarkdownModule } from '../share/demo-markdown/demo-markdown.module';

import { DemoIntroI18nComponent } from './demo-intro-i18n.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: DemoIntroI18nComponent }]), DemoMarkdownModule],
  exports: [],
  declarations: [DemoIntroI18nComponent],
  providers: []
})
export class DemoIntroI18nModule {}
