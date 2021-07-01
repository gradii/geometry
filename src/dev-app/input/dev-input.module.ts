/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriGridModule } from '@gradii/triangle/grid';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriInputNumberModule } from '@gradii/triangle/input-number';
import { TriDatePickerModule } from '@gradii/triangle/date-picker';
import { TriSelectModule } from '@gradii/triangle/select';
import { DevInput } from './dev-input';
import { TriDemoInputAddOnComponent } from './tri-demo-input/tri-demo-input-add-on.component';
import { TriDemoInputAffixComponent } from './tri-demo-input/tri-demo-input-affix.component';
import { TriDemoInputBasicComponent } from './tri-demo-input/tri-demo-input-basic.component';
import { TriDemoInputDisabledComponent } from './tri-demo-input/tri-demo-input-disabled.component';
import { TriDemoInputGroupComponent } from './tri-demo-input/tri-demo-input-group.component';
import { TriDemoInputReadonlyComponent } from './tri-demo-input/tri-demo-input-readonly.component';
import { TriDemoInputSearchComponent } from './tri-demo-input/tri-demo-input-search.component';
import { TriDemoInputSizeComponent } from './tri-demo-input/tri-demo-input-size.component';
import { TriDemoInputTextareaAutoSizeComponent } from './tri-demo-input/tri-demo-input-textarea-auto-size.component';
import { TriDemoInputTextareaComponent } from './tri-demo-input/tri-demo-input-textarea.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    TriInputModule,
    TriSelectModule,
    TriInputNumberModule,
    TriGridModule,
    TriIconModule,
    TriDatePickerModule,
    
    RouterModule.forChild([
      {
        path: '', component: DevInput, children: [
          {path: 'tri-demo-input-add-on', component: TriDemoInputAddOnComponent},
          {path: 'tri-demo-input-affix', component: TriDemoInputAffixComponent},
          {path: 'tri-demo-input-basic', component: TriDemoInputBasicComponent},
          {path: 'tri-demo-input-disabled', component: TriDemoInputDisabledComponent},
          {path: 'tri-demo-input-group', component: TriDemoInputGroupComponent},
          {path: 'tri-demo-input-readonly', component: TriDemoInputReadonlyComponent},
          {path: 'tri-demo-input-search', component: TriDemoInputSearchComponent},
          {path: 'tri-demo-input-size', component: TriDemoInputSizeComponent},
          {path: 'tri-demo-input-textarea', component: TriDemoInputTextareaComponent},
          {
            path     : 'tri-demo-input-textarea-auto-size',
            component: TriDemoInputTextareaAutoSizeComponent
          },
        ]
      }
    ]),
  ],
  declarations: [
    DevInput,

    TriDemoInputAddOnComponent,
    TriDemoInputAffixComponent,
    TriDemoInputBasicComponent,
    TriDemoInputDisabledComponent,
    TriDemoInputGroupComponent,
    TriDemoInputReadonlyComponent,
    TriDemoInputSearchComponent,
    TriDemoInputSizeComponent,
    TriDemoInputTextareaComponent,
    TriDemoInputTextareaAutoSizeComponent
  ]
})
export class DevInputModule {
}
