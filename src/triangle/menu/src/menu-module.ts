/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { TriContextMenuTrigger } from './context-menu';
import { TriMenu } from './menu';
import { TriTargetMenuAim } from './menu-aim';
import { TriMenuBar } from './menu-bar';
import { TriMenuGroup } from './menu-group';
import { TriMenuItem } from './menu-item';
import { TriMenuItemCheckbox } from './menu-item-checkbox';
import { TriMenuItemRadio } from './menu-item-radio';
import { TriMenuItemTrigger } from './menu-item-trigger';
import { TriMenuPanel } from './menu-panel';

const EXPORTED_DECLARATIONS = [
  TriMenuBar,
  TriMenu,
  TriMenuPanel,
  TriMenuItem,
  TriMenuItemRadio,
  TriMenuItemCheckbox,
  TriMenuItemTrigger,
  TriMenuGroup,
  TriContextMenuTrigger,
  TriTargetMenuAim,
];

@NgModule({
  imports     : [OverlayModule],
  exports     : EXPORTED_DECLARATIONS,
  declarations: EXPORTED_DECLARATIONS,
})
export class TriMenuModule {
}
