/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriAlertModule } from '@gradii/triangle/alert';
import { DevAlertComponent } from './dev-alert.component';
import { TriDemoAlert4TypeComponent } from './tri-demo-alert/tri-demo-4-type.component';
import { TriDemoAlert4TypeMessageComponent } from './tri-demo-alert/tri-demo-alert-4-type-message.component';
import { TriDemoAlertBasicComponent } from './tri-demo-alert/tri-demo-alert-basic.component';
import { TriDemoAlertCloseableComponent } from './tri-demo-alert/tri-demo-alert-closeable.component';
import { TriDemoAlertIconComponent } from './tri-demo-alert/tri-demo-alert-icon.component';
import { TriDemoAlertIconCloseComponent } from './tri-demo-alert/tri-demo-alert-icon-close.component';
import { TriDemoAlertLongDescriptionComponent } from './tri-demo-alert/tri-demo-alert-long-description.component';
import { TriDemoAlertSelfCloseComponent } from './tri-demo-alert/tri-demo-alert-self-close.component';

@NgModule({
  imports: [
    TriAlertModule,

    RouterModule.forChild([
      {
        path: '', component: DevAlertComponent, children: [
          {path: 'tri-demo-4-type', component: TriDemoAlert4TypeComponent},
          {path: 'tri-demo-alert-4-type-message', component: TriDemoAlert4TypeMessageComponent},
          {path: 'tri-demo-alert-basic', component: TriDemoAlertBasicComponent},
          {path: 'tri-demo-alert-closeable', component: TriDemoAlertCloseableComponent},
          {path: 'tri-demo-alert-icon', component: TriDemoAlertIconComponent},
          {path: 'tri-demo-alert-icon-close', component: TriDemoAlertIconCloseComponent},
          {path: 'tri-demo-alert-long-description', component: TriDemoAlertLongDescriptionComponent},
          {path: 'tri-demo-alert-self-close', component: TriDemoAlertSelfCloseComponent},
        ]
      }
    ])
  ],
  declarations: [
    DevAlertComponent,

    TriDemoAlert4TypeComponent,
    TriDemoAlert4TypeMessageComponent,
    TriDemoAlertBasicComponent,
    TriDemoAlertCloseableComponent,
    TriDemoAlertIconComponent,
    TriDemoAlertIconCloseComponent,
    TriDemoAlertLongDescriptionComponent,
    TriDemoAlertSelfCloseComponent,
  ]
})
export class DevAlertModule {

}