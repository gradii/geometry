/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckableTagComponent } from './checkable-tag.component';
import { TagComponent } from './tag.component';

/**
 * tag
 */
@NgModule({
  imports     : [CommonModule, FormsModule],
  declarations: [TagComponent, CheckableTagComponent],
  exports     : [TagComponent, CheckableTagComponent]
})
export class TriTagModule {}
