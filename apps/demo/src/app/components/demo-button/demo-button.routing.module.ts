import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoButtonComponent } from './demo-button.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: DemoButtonComponent }])],
  exports: [RouterModule]
})
export class DemoButtonRoutingModule {}
