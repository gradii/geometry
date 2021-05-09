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
import { TriContextMenu } from './context-menu';
import { TriContextMenuContent } from './context-menu-content';
import { TriContextMenuItem } from './context-menu-item';
import { TRI_CONTEXT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER, TriContextMenuTrigger } from './context-menu-trigger';

/**
 * Used by both the current `TriContextMenuModule` and the MDC `TriContextMenuModule`
 * to declare the menu-related directives.
 */
@NgModule({
  exports     : [TriContextMenuTrigger, TriContextMenuContent, TriCommonModule],
  declarations: [
    TriContextMenuTrigger,
    TriContextMenuContent,
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
    CdkScrollableModule, TriCommonModule, TriContextMenu, TriContextMenuItem, _TriContextMenuDirectivesModule
  ],
  declarations: [TriContextMenu, TriContextMenuItem],
  providers   : [TRI_CONTEXT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class TriContextMenuModule {
}
