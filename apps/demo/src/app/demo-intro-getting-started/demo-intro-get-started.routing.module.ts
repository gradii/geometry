import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoIntroGetStartedComponent } from './demo-intro-get-started.component';

@NgModule({
  imports: [RouterModule.forChild([{path: '', component: DemoIntroGetStartedComponent}])],
  exports: [RouterModule]
})
export class DemoIntroGetStartedRoutingModule {}
