/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule } from '@gradii/triangle/core';
import { TriDrawer, TriDrawerContainer, TriDrawerContent } from './drawer';


@NgModule({
  imports     : [
    CommonModule,
    TriCommonModule,
    PlatformModule,
    CdkScrollableModule,
  ],
  exports     : [
    CdkScrollableModule,
    TriCommonModule,
    TriDrawer,
    TriDrawerContainer,
    TriDrawerContent,
  ],
  declarations: [
    TriDrawer,
    TriDrawerContainer,
    TriDrawerContent,
  ],
})
export class TriDrawerModule {
}
