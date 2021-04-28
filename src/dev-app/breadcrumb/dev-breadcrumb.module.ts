/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriBreadcrumbModule } from '@gradii/triangle/breadcrumb';
import { TriIconModule } from '@gradii/triangle/icon';
import { DevBreadcrumbComponent } from './dev-breadcrumb.component';
import { TriDemoBreadcrumbBasicComponent } from './tri-demo-breadcrumb/tri-demo-breadcrumb-basic.component';
import { TriDemoBreadcrumbIconComponent } from './tri-demo-breadcrumb/tri-demo-breadcrumb-icon.component';
import { TriDemoBreadcrumbSeparatorComponent } from './tri-demo-breadcrumb/tri-demo-breadcrumb-separator.component';

@NgModule({
  imports     : [
    TriIconModule,
    TriBreadcrumbModule,

    RouterModule.forChild([
      {
        path: '', component: DevBreadcrumbComponent, children: [
          {path: 'tri-demo-breadcrumb-basic', component: TriDemoBreadcrumbBasicComponent},
          {path: 'tri-demo-breadcrumb-icon', component: TriDemoBreadcrumbIconComponent},
          {path: 'tri-demo-breadcrumb-separator', component: TriDemoBreadcrumbSeparatorComponent},
        ]
      }
    ])
  ],
  declarations: [
    DevBreadcrumbComponent,

    TriDemoBreadcrumbBasicComponent,
    TriDemoBreadcrumbIconComponent,
    TriDemoBreadcrumbSeparatorComponent
  ]
})
export class DevBreadcrumbModule {

}
