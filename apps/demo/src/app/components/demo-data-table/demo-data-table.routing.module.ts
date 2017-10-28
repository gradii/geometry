import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoDataTableComponent } from './demo-data-table.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: DemoDataTableComponent }])],
  exports: [RouterModule]
})
export class DemoDataTableRoutingModule {}
