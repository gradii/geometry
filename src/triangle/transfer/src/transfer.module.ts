/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriI18nModule } from '@gradii/triangle/i18n';
import { TriInputModule } from '@gradii/triangle/input';
import { TransferListComponent } from './transfer-list.component';
import { TransferSearchComponent } from './transfer-search.component';
import { TransferComponent } from './transfer.component';

@NgModule({
  imports     : [CommonModule, FormsModule, TriCheckboxModule, TriButtonModule, TriInputModule, TriI18nModule],
  declarations: [TransferComponent, TransferListComponent, TransferSearchComponent],
  exports     : [TransferComponent]
})
export class TriTransferModule {}
