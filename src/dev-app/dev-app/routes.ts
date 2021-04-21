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
        loadChildren: '/autocomplete/autocomplete-demo-module#AutocompleteDemoModule'
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
      },
      {
        path        : 'collapse',
        loadChildren: '/collapse/dev-collapse.module#DevCollapseModule'
      },
      {
        path        : 'button',
        loadChildren: '/button/dev-button.module#DevButtonModule'
      },
      {
        path        : 'icon',
        loadChildren: '/icon/dev-icon.module#DevIconModule'
      },
      {
        path        : 'tree-view',
        loadChildren: '/tree-view/dev-tree-view.module#DevTreeViewModule'
      },
      {
        path        : 'select',
        loadChildren: '/select/dev-select.module#DevSelectModule'
      },
      {
        path        : 'radio',
        loadChildren: '/radio/dev-radio.module#DevRadioModule'
      },
      {
        path        : 'drawer',
        loadChildren: '/drawer/dev-drawer.module#DevDrawerModule'
      },
      {
        path        : 'transfer',
        loadChildren: '/transfer/dev-transfer.module#DevTransferModule'
      },
      {
        path        : 'card',
        loadChildren: '/card/dev-card.module#DevCardModule'
      },
      {
        path        : 'calendar',
        loadChildren: '/calendar/dev-calendar.module#DevCalendarModule'
      },
      {
        path        : 'carousel',
        loadChildren: '/carousel/dev-carousel.module#DevCarouselModule'
      },
      {
        path        : 'cascader',
        loadChildren: '/cascader/dev-cascader.module#DevCascaderModule'
      },
      {
        path        : 'checkbox',
        loadChildren: '/checkbox/dev-checkbox.module#DevCheckboxModule'
      },
      {
        path        : 'dialog',
        loadChildren: '/dialog/dev-dialog.module#DevDialogModule'
      }
    ]
  },

  {path: '**', component: DevApp404},
];
