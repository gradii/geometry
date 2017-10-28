import {TriangleExampleModule, TriangleModule} from '@gradii/triangle-examples';
import {TriDataTableModule} from "@gradii/triangle/data-table";
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DemoCodeBoxModule} from '../../share/demo-codebox/demo-codebox.module';

import {DemoDataTableComponent} from './demo-data-table.component';
import {DemoDataTableRoutingModule} from './demo-data-table.routing.module';
import {DemoDataTableBasicComponent} from "./examples/demo-data-table-basic.component";

@NgModule({
  imports     : [
    // NgZorroAntdModule,

    TriangleModule,
    TriangleExampleModule,
    TriDataTableModule,

    DemoDataTableRoutingModule,
    CommonModule,
    FormsModule,
    DemoCodeBoxModule
  ],
  declarations: [
    DemoDataTableComponent,
    DemoDataTableBasicComponent]
})
export class DemoDataTableModule {}
