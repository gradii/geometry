import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { DemoGlobalResolver } from '../app.resolver';
import { DemoIntroComponent } from './demo-intro.component';

@NgModule({
  imports: [RouterModule.forChild([{path: '', component: DemoIntroComponent}])],
  exports: [RouterModule]
})
export class DemoIntroRoutingModule {}
