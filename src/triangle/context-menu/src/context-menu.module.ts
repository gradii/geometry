/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbOverlayModule } from '../cdk/overlay/overlay.module';
import { ContextMenuDirective } from './context-menu.directive';
import { NbContextMenuComponent } from './context-menu.component';
import { NbMenuModule } from '../menu/menu.module';


@NgModule({
  imports: [CommonModule, NbOverlayModule, NbMenuModule],
  exports: [ContextMenuDirective],
  declarations: [ContextMenuDirective, NbContextMenuComponent],
  entryComponents: [NbContextMenuComponent],
})
export class TriContextMenuModule {
}
