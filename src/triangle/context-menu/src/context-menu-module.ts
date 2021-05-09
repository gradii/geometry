/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule, TriRippleModule } from '@gradii/triangle/core';
import { MatMenu } from './menu';
import { MatMenuContent } from './menu-content';
import { MatMenuItem } from './menu-item';
import { TRI_CONTEXT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER, MatMenuTrigger } from './context-menu-trigger';

/**
 * Used by both the current `MatMenuModule` and the MDC `MatMenuModule`
 * to declare the menu-related directives.
 */
@NgModule({
  exports     : [MatMenuTrigger, MatMenuContent, TriCommonModule],
  declarations: [
    MatMenuTrigger,
    MatMenuContent,
  ],
  providers   : [TRI_CONTEXT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class _TriContextMenuDirectivesModule {
}

@NgModule({
  imports     : [
    CommonModule,
    TriCommonModule,
    TriRippleModule,
    OverlayModule,
    _TriContextMenuDirectivesModule,
  ],
  exports     : [
    CdkScrollableModule, TriCommonModule, MatMenu, MatMenuItem, _TriContextMenuDirectivesModule
  ],
  declarations: [MatMenu, MatMenuItem],
  providers   : [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class MatMenuModule {
}
