/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriConfirmPopupModule } from '@gradii/triangle/confirm-popup';
import { TriMessageModule } from '@gradii/triangle/message';
import { DevConfirmPopup } from './dev-confirm-popup';
import { TriDemoConfirmPopupAutoHideComponent } from './tri-demo-confirm-popup/tri-demo-confirm-popup-auto-hide.component';
import { TriDemoConfirmPopupBasicComponent } from './tri-demo-confirm-popup/tri-demo-confirm-popup-basic.component';
import { TriDemoConfirmPopupKickComponent } from './tri-demo-confirm-popup/tri-demo-confirm-popup-kick.component';
import { TriDemoConfirmPopupLocalComponent } from './tri-demo-confirm-popup/tri-demo-confirm-popup-locale.component';
import { TriDemoConfirmPopupLocationComponent } from './tri-demo-confirm-popup/tri-demo-confirm-popup-location.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriButtonModule,
    TriMessageModule,
    TriConfirmPopupModule,

    RouterModule.forChild([
      {
        path: '', component: DevConfirmPopup, children: [
          {path: 'tri-demo-confirm-popup-basic', component: TriDemoConfirmPopupBasicComponent},
          {path: 'tri-demo-confirm-popup-kick', component: TriDemoConfirmPopupKickComponent},
          {path: 'tri-demo-confirm-popup-locale', component: TriDemoConfirmPopupLocalComponent},
          {
            path     : 'tri-demo-confirm-popup-location',
            component: TriDemoConfirmPopupLocationComponent
          },
          {
            path     : 'tri-demo-confirm-popup-auto-hide',
            component: TriDemoConfirmPopupAutoHideComponent
          },
        ]
      }
    ]),
  ],
  declarations: [
    DevConfirmPopup,

    TriDemoConfirmPopupBasicComponent,
    TriDemoConfirmPopupKickComponent,
    TriDemoConfirmPopupLocalComponent,
    TriDemoConfirmPopupLocationComponent,
    TriDemoConfirmPopupAutoHideComponent
  ]
})
export class DevConfirmPopupModule {
}
