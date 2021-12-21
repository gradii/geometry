import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DemoFormBuilderComponent } from './demo-form-builder/demo-form-builder.component';
import { DemoCustomFormFieldComponent } from './demo-custom-form-field/demo-custom-form-field.component';
import { DemoInstanceApplyComponent } from './demo-instance-apply/demo-instance-apply.component';
import { DemoChangeSelectComponent } from './demo-change-select/demo-change-select.component';
import { DemoValidationComponent } from './demo-validation/demo-validation.component';
import { DemoUseOneFormLayoutComponent } from './demo-use-one-form-layout/demo-use-one-form-layout.component';


const routers = [
  {
    path: 'demo-form-builder',
    component: DemoFormBuilderComponent
  },
  {
    path: 'demo-custom-form-field',
    component: DemoCustomFormFieldComponent
  },
  {
    path: 'demo-instance-apply',
    component: DemoInstanceApplyComponent
  },
  {
    path: 'demo-change-select',
    component: DemoChangeSelectComponent
  },
  {
    path: 'demo-validation',
    component: DemoValidationComponent
  },
  {
    path: 'demo-use-one-form-layout',
    component: DemoUseOneFormLayoutComponent
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,

    BrowserModule,
    RouterModule.forChild(routers)
  ],
  providers: []
})
export class AppRoutingModule {
}
