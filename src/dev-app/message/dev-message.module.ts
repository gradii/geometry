/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriSwitchModule } from '@gradii/triangle/switch';
import { TriMenuModule } from '@gradii/triangle/menu';
import { DevMessage } from './dev-message';
import { FormsModule } from '@angular/forms';
import { TriDemoMessageBasicComponent } from './tri-demo-message/tri-demo-message-basic.component';
import { TriDemoMessageDurationComponent } from './tri-demo-message/tri-demo-message-duration.component';
import { TriDemoMessageIconComponent } from './tri-demo-message/tri-demo-message-icon.component';
import { TriDemoMessageLoadingComponent } from './tri-demo-message/tri-demo-message-loading.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    
    TriMenuModule,

    RouterModule.forChild([
      {
        path: '', component: DevMessage, children: [
          { path: 'tri-demo-message-basic', component: TriDemoMessageBasicComponent },
          { path: 'tri-demo-message-duration', component: TriDemoMessageDurationComponent },
          { path: 'tri-demo-message-icon', component: TriDemoMessageIconComponent },
          { path: 'tri-demo-message-loading', component: TriDemoMessageLoadingComponent },
        ]
      }
    ]),
  ],
  declarations: [
    DevMessage,

    TriDemoMessageBasicComponent,
    TriDemoMessageDurationComponent,
    TriDemoMessageIconComponent,
    TriDemoMessageLoadingComponent,
  ]
})
export class DevMenuModule {
}
