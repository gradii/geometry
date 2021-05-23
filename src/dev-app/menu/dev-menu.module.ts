/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriMenuModule } from '@gradii/triangle/menu';
import { TriSwitchModule } from '@gradii/triangle/switch';
import { DevMenu } from './dev-menu';
import { TriDemoMenuBasicComponent } from './tri-demo-menu/tri-demo-menu-basic.component';
import { TriDemoMenuCollapsedComponent } from './tri-demo-menu/tri-demo-menu-collapsed.component';
import { TriDemoMenuDataSourceComponent } from './tri-demo-menu/tri-demo-menu-data-source.component';
import { TriDemoMenuDynamicComponent } from './tri-demo-menu/tri-demo-menu-dynamic.component';
import { TriDemoMenuExpandComponent } from './tri-demo-menu/tri-demo-menu-expand.component';
import { TriDemoMenuInlineComponent } from './tri-demo-menu/tri-demo-menu-inline.component';
import { TriDemoMenuThemeComponent } from './tri-demo-menu/tri-demo-menu-theme.component';
import { TriDemoMenuVerticalComponent } from './tri-demo-menu/tri-demo-menu-vertical.component';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriSwitchModule,
    TriMenuModule,

    RouterModule.forChild([
      {
        path: '', component: DevMenu, children: [
          {path: 'tri-demo-menu-basic', component: TriDemoMenuBasicComponent},
          {path: 'tri-demo-menu-collapsed', component: TriDemoMenuCollapsedComponent},
          {path: 'tri-demo-menu-data-source', component: TriDemoMenuDataSourceComponent},
          {path: 'tri-demo-menu-dynamic', component: TriDemoMenuDynamicComponent},
          {path: 'tri-demo-menu-expand', component: TriDemoMenuExpandComponent},
          {path: 'tri-demo-menu-inline', component: TriDemoMenuInlineComponent},
          {path: 'tri-demo-menu-theme', component: TriDemoMenuThemeComponent},
          {path: 'tri-demo-menu-vertical', component: TriDemoMenuVerticalComponent},
        ]
      }
    ]),
  ],
  declarations: [
    DevMenu,

    TriDemoMenuBasicComponent,
    TriDemoMenuCollapsedComponent,
    TriDemoMenuDataSourceComponent,
    TriDemoMenuDynamicComponent,
    TriDemoMenuExpandComponent,
    TriDemoMenuInlineComponent,
    TriDemoMenuThemeComponent,
    TriDemoMenuVerticalComponent,
  ]
})
export class DevMenuModule {
}
