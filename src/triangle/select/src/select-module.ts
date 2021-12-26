/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule, TriOptionModule } from '@gradii/triangle/core';
import { TRI_SELECT_SCROLL_STRATEGY_PROVIDER } from './select-config';
import { TriSelectTrigger } from './select-trigger';
import { TriSelect } from './select.component';

@NgModule({
  imports     : [CommonModule, OverlayModule, TriOptionModule, TriCommonModule],
  exports     : [
    CdkScrollableModule,
    TriSelect,
    TriSelectTrigger,
    TriOptionModule,
    TriCommonModule,
  ],
  declarations: [TriSelect, TriSelectTrigger],
  providers   : [TRI_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class TriSelectModule {
}
