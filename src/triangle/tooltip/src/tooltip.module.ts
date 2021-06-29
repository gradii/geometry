/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule } from '@gradii/triangle/core';
import { TooltipDirective } from './tooltip.directive';
import { TooltipComponent } from './tooltip.component';
import { TRI_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from './tooltip.common';

@NgModule({
  imports        : [
    A11yModule,
    CommonModule,
    OverlayModule,
    TriCommonModule,
  ],
  exports        : [
    TooltipDirective,
    TooltipComponent,
    TriCommonModule,
    CdkScrollableModule
  ],
  declarations   : [TooltipDirective, TooltipComponent],
  providers      : [TRI_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class TriTooltipModule {
}
