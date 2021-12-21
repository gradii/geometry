import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DemoFormBuilderComponent } from './demo-form-builder/demo-form-builder.component';
import { FormRender } from './form-builder/form-render';
import { DefaultFormRender } from './form-builder/form-render/default-form-render';
import { FormLayoutDefine } from './form-builder/form-render/form-layout-define.directive';
import { ShadowFormFieldControlSlot } from './form-builder/form-render/shadow-form-field-control-slot.directive';
import {
  ShadowFormFieldLayout,
  ShadowFormFieldLayoutOutlet
} from './form-builder/form-render/shadow-form-field-outlet.directive';
import {
  ShadowFormLayoutComponent,
  ShadowFormLayoutDefine
} from './form-builder/form-render/shadow-form-layout-define.directive';
import {
  ShadowFormLayoutOutlet,
  ShadowFormLayoutOutletDirective
} from './form-builder/form-render/shadow-form-layout-outlet.directive';
import { AppRoutingModule } from './app-routing.module';
import { DemoCustomFormFieldComponent } from './demo-custom-form-field/demo-custom-form-field.component';
import { InputFormFieldComponent } from './form-builder/form-field/input-form-field.component';
import { SelectFormFieldComponent } from './form-builder/form-field/select-form-field.component';
import { DemoInstanceApplyComponent } from './demo-instance-apply/demo-instance-apply.component';
import { PortalModule } from '@angular/cdk/portal';
import { DemoChangeSelectComponent } from './demo-change-select/demo-change-select.component';
import { DemoValidationComponent } from './demo-validation/demo-validation.component';
import { DemoUseOneFormLayoutComponent } from './demo-use-one-form-layout/demo-use-one-form-layout.component';

@NgModule({
  declarations: [
    AppComponent,

    FormRender,

    DemoFormBuilderComponent,

    FormLayoutDefine,
    ShadowFormLayoutDefine,
    ShadowFormLayoutOutlet,
    ShadowFormFieldLayoutOutlet,
    ShadowFormFieldControlSlot,
    ShadowFormFieldLayout,
    DefaultFormRender,

    ShadowFormLayoutComponent,
    DemoCustomFormFieldComponent,

    InputFormFieldComponent,
    SelectFormFieldComponent,
    DemoInstanceApplyComponent,

    ShadowFormLayoutOutletDirective,

    DemoChangeSelectComponent,
    DemoValidationComponent,
    DemoUseOneFormLayoutComponent
  ],
  imports: [
    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),

    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    PortalModule,
    ReactiveFormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
