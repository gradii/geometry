/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GridsterComponent } from './gridster.component';
import { GridsterItemComponent } from './gridster-item.component';
import { GridsterPreviewComponent } from './gridster-preview.component';

@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent,
    GridsterPreviewComponent
  ],
  imports     : [
    CommonModule
  ],
  exports     : [GridsterComponent, GridsterItemComponent]
})
export class GridsterModule {
}
