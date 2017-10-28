import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { DemoButtonTypeComponent } from './demo-button-type.component';
// import { DemoButtonIconComponent } from './demo-button-icon.component';
// import { DemoButtonSizeComponent } from './demo-button-size.component';
// import { DemoButtonDisabledComponent } from './demo-button-disabled.component';
// import { DemoButtonLoadingComponent } from './demo-button-loading.component';
// import { DemoButtonGroupComponent } from './demo-button-group.component';
// import { DemoButtonGhostComponent } from './demo-button-ghost.component';
// import { DemoButtonMultipleComponent } from './demo-button-multiple.component';
import { DemoButtonComponent } from './demo-button.component';
import { DemoButtonRoutingModule } from './demo-button.routing.module';
import { DemoCodeBoxModule } from '../../share/demo-codebox/demo-codebox.module';
import { EXAMPLE_LIST, TriangleExampleModule, TriangleModule } from '@gradii/triangle-examples';
// import { CodeBoxModule } from '../share/codebox/codebox.module';
// import { NgZorroAntdModule } from '../../../index.showcase';
// import { DemoButtonRoutingModule } from './demo-button.routing.module';

@NgModule({
  imports: [
    // NgZorroAntdModule,

    TriangleModule,
    TriangleExampleModule,

    DemoButtonRoutingModule,
    CommonModule,
    FormsModule,
    DemoCodeBoxModule
  ],
  declarations: [
    DemoButtonComponent
    // DemoButtonTypeComponent,
    // DemoButtonIconComponent,
    // DemoButtonSizeComponent,
    // DemoButtonDisabledComponent,
    // DemoButtonLoadingComponent,
    // DemoButtonGhostComponent,
    // DemoButtonGroupComponent,
    // DemoButtonMultipleComponent
  ]
})
export class DemoButtonModule {}
