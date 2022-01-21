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
      // {
      //   path        : 'autocomplete',
      //   loadChildren: () => import('../autocomplete/autocomplete-demo-module').then(
      //     it => it.AutocompleteDemoModule)
      // },
      {
        path        : 'input',
        loadChildren: () => import('../input/dev-input.module').then(it => it.DevInputModule)
      },
      {
        path        : 'input-number',
        loadChildren: () => import('../input-number/dev-input-number.module').then(
          it => it.DevInputNumberModule)
      },
      {
        path        : 'alert',
        loadChildren: () => import('../alert/dev-alert.module').then(it => it.DevAlertModule)
      },
      {
        path        : 'tabs',
        loadChildren: () => import('../tabs/dev-tabs.module').then(it => it.DevTabsModule)
      },
      {
        path        : 'accordion',
        loadChildren: () => import('../accordion/dev-accordion.module').then(
          it => it.DevAccordionModule)
      },
      {
        path        : 'button',
        loadChildren: () => import('../button/dev-button.module').then(it => it.DevButtonModule)
      },
      {
        path        : 'button-toggle',
        loadChildren: () => import('../button-toggle/dev-button-toggle.module').then(
          it => it.DevButtonToggleModule)
      },
      {
        path        : 'icon',
        loadChildren: () => import('../icon/dev-icon.module').then(it => it.DevIconModule)
      },
      {
        path        : 'tree-view',
        loadChildren: () => import('../tree-view/dev-tree-view.module').then(
          it => it.DevTreeViewModule)
      },
      {
        path        : 'select',
        loadChildren: () => import('../select/dev-select.module').then(it => it.DevSelectModule)
      },
      {
        path        : 'combobox',
        loadChildren: () => import('../combobox/dev-combobox.module').then(
          it => it.DevComboboxModule)
      },
      {
        path        : 'radio',
        loadChildren: () => import('../radio/dev-radio.module').then(it => it.DevRadioModule)
      },
      {
        path        : 'drawer',
        loadChildren: () => import('../drawer/dev-drawer.module').then(it => it.DevDrawerModule)
      },
      {
        path        : 'transfer',
        loadChildren: () => import('../transfer/dev-transfer.module').then(
          it => it.DevTransferModule)
      },
      {
        path        : 'card',
        loadChildren: () => import('../card/dev-card.module').then(it => it.DevCardModule)
      },
      {
        path        : 'calendar',
        loadChildren: () => import('../calendar/dev-calendar.module').then(
          it => it.DevCalendarModule)
      },
      {
        path        : 'carousel',
        loadChildren: () => import('../carousel/dev-carousel.module').then(
          it => it.DevCarouselModule)
      },
      {
        path        : 'cascader',
        loadChildren: () => import('../cascader/dev-cascader.module').then(
          it => it.DevCascaderModule)
      },
      {
        path        : 'checkbox',
        loadChildren: () => import('../checkbox/dev-checkbox.module').then(
          it => it.DevCheckboxModule)
      },
      {
        path        : 'dialog',
        loadChildren: () => import('../dialog/dev-dialog.module').then(it => it.DevDialogModule)
      },
      {
        path        : 'menu',
        loadChildren: () => import('../menu/dev-menu.module').then(it => it.DevMenuModule)
      },
      {
        path        : 'message',
        loadChildren: () => import('../message/dev-message.module').then(it => it.DevMessageModule)
      },
      {
        path        : 'pagination',
        loadChildren: () => import('../pagination/dev-pagination.module').then(
          it => it.DevPaginationModule)
      },
      {
        path        : 'tooltip',
        loadChildren: () => import('../tooltip/dev-tooltip.module').then(it => it.DevTooltipModule)
      },
      {
        path        : 'popover',
        loadChildren: () => import('../popover/dev-popover.module').then(it => it.DevPopoverModule)
      },
      {
        path        : 'confirm-popup',
        loadChildren: () => import('../confirm-popup/dev-confirm-popup.module').then(
          it => it.DevConfirmPopupModule)
      },
      {
        path        : 'badge',
        loadChildren: () => import('../badge/dev-badge.module').then(it => it.DevBadgeModule)
      },
      {
        path        : 'breadcrumb',
        loadChildren: () => import('../breadcrumb/dev-breadcrumb.module').then(
          it => it.DevBreadcrumbModule)
      },
      {
        path        : 'rate',
        loadChildren: () => import('../rate/dev-rate.module').then(it => it.DevRateModule)
      },
      {
        path        : 'grid-list',
        loadChildren: () => import('../grid-list/dev-grid-list.module').then(
          it => it.DevGridListModule)
      },
      {
        path        : 'list',
        loadChildren: () => import('../list/dev-list.module').then(it => it.DevListModule)
      },
      {
        path        : 'avatar',
        loadChildren: () => import('../avatar/dev-avatar.module').then(it => it.DevAvatarModule)
      },
      // {
      //   path        : 'cube',
      //   loadChildren: () => import('../cube/dev-cube.module').then(it => it.DevCubeModule)
      // },
      {
        path        : 'diagram',
        loadChildren: () => import('../diagram/dev-diagram.module').then(it => it.DevDiagramModule)
      },
      // {
      //   path        : 'tree-select',
      //   loadChildren: () => import('../tree-select/dev-tree-select.module').then(
      //     it => it.DevTreeSelectModule)
      // },
      {
        path        : 'dnd',
        loadChildren: () => import('../dnd/dev-drag-and-drop.module').then(
          it => it.DevDragAndDropModule)
      },
      {
        path        : 'sidenav',
        loadChildren: () => import('../sidenav/dev-sidenav.module').then(it => it.DevSidenavModule)
      },
      {
        path        : 'navbar',
        loadChildren: () => import('../navbar/dev-navbar.module').then(it => it.DevNavbarModule)
      },
      {
        path        : 'gridster',
        loadChildren: () => import('../gridster/dev-gridster.module').then(
          it => it.DevGridsterModule)
      },
      {
        path        : 'form',
        loadChildren: () => import('../form/dev-form.module').then(it => it.DevFormModule)
      },
      {
        path        : 'form-field',
        loadChildren: () => import('../form-field/dev-form-field.module').then(
          it => it.DevFormFieldModule)
      },
      {
        path        : 'splitter',
        loadChildren: () => import('../splitter/dev-splitter.module').then(
          it => it.DevSplitterModule)
      }
    ]
  },
  // {
  //   path: '', component: DevAppHome, children: [
  //     {
  //       path        : 'cube',
  //       loadChildren: () => import('../cube/dev-cube.module').then(it => it.DevCubeModule)
  //     }
  //   ]
  // },

  {path: '**', component: DevApp404},
];
