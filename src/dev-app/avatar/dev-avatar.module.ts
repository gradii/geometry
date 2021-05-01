/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriAvatarModule } from '@gradii/triangle/avatar';
import { TriBadgeModule } from '@gradii/triangle/badge';
import { TriButtonModule } from '@gradii/triangle/button';
import { DevAvatarComponent } from './dev-avatar.component';
import { TriDemoAvatarAutosizeComponent } from './tri-demo-avatar/tri-demo-avatar-autosize.component';
import { TriDemoAvatarBadgeComponent } from './tri-demo-avatar/tri-demo-avatar-badge.component';
import { TriDemoAvatarBasicComponent } from './tri-demo-avatar/tri-demo-avatar-basic.component';
import { TriDemoAvatarTypeComponent } from './tri-demo-avatar/tri-demo-avatar-type.component';

@NgModule({
  imports     : [
    CommonModule,

    TriBadgeModule,
    TriButtonModule,

    TriAvatarModule,

    RouterModule.forChild([
      {
        path: '', component: DevAvatarComponent, children: [
          {path: 'tri-demo-avatar-autosize', component: TriDemoAvatarAutosizeComponent},
          {path: 'tri-demo-avatar-badge', component: TriDemoAvatarBadgeComponent},
          {path: 'tri-demo-avatar-basic', component: TriDemoAvatarBasicComponent},
          {path: 'tri-demo-avatar-type', component: TriDemoAvatarTypeComponent},
        ]
      }
    ]),

  ],
  declarations: [
    DevAvatarComponent,

    TriDemoAvatarAutosizeComponent,
    TriDemoAvatarBadgeComponent,
    TriDemoAvatarBasicComponent,
    TriDemoAvatarTypeComponent,
  ]
})
export class DevAvatarModule {

}
