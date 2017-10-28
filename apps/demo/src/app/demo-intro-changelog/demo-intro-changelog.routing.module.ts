import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoIntroChangelogComponent } from './demo-intro-changelog.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: DemoIntroChangelogComponent }])],
  exports: [RouterModule]
})
export class DemoIntroChangeLogRoutingModule {}
