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
import { DevMenu } from './dev-menu';
import { TriDemoMenuBasicExample } from './tri-demo-menu-basic/menu-basic-example';
import { TriDemoMenuContextExample } from './tri-demo-menu-context/menu-context-example';
import { TriDemoMenuInlineExample } from './tri-demo-menu-inline/menu-inline-example';
import { TriDemoMenuMenubarExample } from './tri-demo-menu-menubar/menu-menubar-example';
import { TriDemoMenuStandaloneMenuExample } from './tri-demo-menu-standalone-menu/menu-standalone-menu-example';
import { TriDemoMenuStandaloneStatefulMenuExample } from './tri-demo-menu-standalone-stateful-menu/menu-standalone-stateful-menu-example';


@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    TriMenuModule,

    RouterModule.forChild([
      {
        path: '', component: DevMenu, children: [
          {path: 'tri-demo-menu-basic', component: TriDemoMenuBasicExample},
          {path: 'tri-demo-menu-context', component: TriDemoMenuContextExample},
          {path: 'tri-demo-menu-inline', component: TriDemoMenuInlineExample},
          {path: 'tri-demo-menu-menubar', component: TriDemoMenuMenubarExample},
          {path: 'tri-demo-menu-standalone-menu', component: TriDemoMenuStandaloneMenuExample},
          {
            path     : 'tri-demo-menu-standalone-stateful-menu',
            component: TriDemoMenuStandaloneStatefulMenuExample
          },

        ]
      }
    ]),
  ],
  declarations: [
    DevMenu,

    TriDemoMenuBasicExample,
    TriDemoMenuContextExample,
    TriDemoMenuInlineExample,
    TriDemoMenuMenubarExample,
    TriDemoMenuStandaloneMenuExample,
    TriDemoMenuStandaloneStatefulMenuExample,

  ]
})
export class DevMenuModule {
}
