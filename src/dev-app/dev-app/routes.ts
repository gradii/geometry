/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Routes } from '@angular/router';
import { DevApp404 } from './dev-app-404';
import { DevAppHome } from './dev-app-home';

export const DEV_APP_ROUTES: Routes = [
  {
    path: '', component: DevAppHome, children: [
      {
        path        : 'autocomplete',
        loadChildren: 'autocomplete/autocomplete-demo-module#AutocompleteDemoModule'
      },
      {
        path        : 'input-number',
        loadChildren: '/input-number/dev-input-number.module#DevInputNumberModule'
      },
      {
        path        : 'alert',
        loadChildren: '/alert/dev-alert.module#DevAlertModule'
      },
      {
        path        : 'tabs',
        loadChildren: '/tabs/dev-tabs.module#DevTabsModule'
      }
    ]
  },

  {path: '**', component: DevApp404},
];
