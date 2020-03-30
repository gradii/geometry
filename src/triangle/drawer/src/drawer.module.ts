/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DrawerComponent } from './drawer.component';
import { DrawerService } from './drawer.service';

@NgModule({
  imports     : [CommonModule, OverlayModule, PortalModule],
  exports     : [DrawerComponent],
  declarations: [DrawerComponent],
  providers   : [DrawerService]
})
export class TriDrawerModule {
}
