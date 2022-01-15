/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContextMenuDirective } from './context-menu.directive';
import { ContextMenuComponent } from './context-menu.component';
import { TriMenuModule } from 'menu/src/menu.module';


@NgModule({
  imports        : [CommonModule, TriMenuModule],
  exports        : [NbContextMenuDirective],
  declarations   : [NbContextMenuDirective, NbContextMenuComponent],
})
export class NbContextMenuModule {
}
