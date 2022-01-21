/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriCascaderModule } from '@gradii/triangle/cascader';
import { DevCascader } from './dev-cascader';
import { TriDemoCascaderBasicComponent } from './tri-demo-cascader/tri-demo-cascader-basic.component';
import { TriDemoCascaderChangeOnSelectComponent } from './tri-demo-cascader/tri-demo-cascader-change-on-select.component';
import { TriDemoCascaderCustomRenderComponent } from './tri-demo-cascader/tri-demo-cascader-custom-render.component';
import { TriDemoCascaderCustomTriggerComponent } from './tri-demo-cascader/tri-demo-cascader-custom-trigger.component';
import { TriDemoCascaderDefaultValueComponent } from './tri-demo-cascader/tri-demo-cascader-default-value.component';
import { TriDemoCascaderDisabledComponent } from './tri-demo-cascader/tri-demo-cascader-disabled.component';
import { TriDemoCascaderHoverComponent } from './tri-demo-cascader/tri-demo-cascader-hover.component';
import { TriDemoCascaderLazyComponent } from './tri-demo-cascader/tri-demo-cascader-lazy.component';
import { TriDemoCascaderReactiveFormComponent } from './tri-demo-cascader/tri-demo-cascader-reactive-form.component';
import { TriDemoCascaderSizeComponent } from './tri-demo-cascader/tri-demo-cascader-size.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TriCascaderModule,

    RouterModule.forChild([
      {
        path: '', component: DevCascader, children: [
          {path: 'tri-demo-cascader-basic', component: TriDemoCascaderBasicComponent},
          {
            path     : 'tri-demo-cascader-change-on-select',
            component: TriDemoCascaderChangeOnSelectComponent
          },
          {
            path     : 'tri-demo-cascader-custom-render',
            component: TriDemoCascaderCustomRenderComponent
          },
          {
            path     : 'tri-demo-cascader-custom-trigger',
            component: TriDemoCascaderCustomTriggerComponent
          },
          {
            path     : 'tri-demo-cascader-default-value',
            component: TriDemoCascaderDefaultValueComponent
          },
          {path: 'tri-demo-cascader-disabled', component: TriDemoCascaderDisabledComponent},
          {path: 'tri-demo-cascader-hover', component: TriDemoCascaderHoverComponent},
          {path: 'tri-demo-cascader-lazy', component: TriDemoCascaderLazyComponent},
          {
            path     : 'tri-demo-cascader-reactive-form',
            component: TriDemoCascaderReactiveFormComponent
          },
          {path: 'tri-demo-cascader-size', component: TriDemoCascaderSizeComponent},
        ]
      }
    ]),
  ],
  declarations: [
    DevCascader,

    TriDemoCascaderBasicComponent,
    TriDemoCascaderChangeOnSelectComponent,
    TriDemoCascaderCustomRenderComponent,
    TriDemoCascaderCustomTriggerComponent,
    TriDemoCascaderDefaultValueComponent,
    TriDemoCascaderDisabledComponent,
    TriDemoCascaderHoverComponent,
    TriDemoCascaderLazyComponent,
    TriDemoCascaderReactiveFormComponent,
    TriDemoCascaderSizeComponent
  ]
})
export class DevCascaderModule {
}
