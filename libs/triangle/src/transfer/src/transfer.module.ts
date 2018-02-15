import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule, TriInputModule } from '@gradii/triangle/inputs';
import { TriLocaleModule } from '@gradii/triangle/locale';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransferListComponent } from './transfer-list.component';
import { TransferSearchComponent } from './transfer-search.component';
import { TransferComponent } from './transfer.component';

@NgModule({
  imports     : [CommonModule, FormsModule, TriCheckboxModule, TriButtonModule, TriInputModule, TriLocaleModule],
  declarations: [TransferComponent, TransferListComponent, TransferSearchComponent],
  exports     : [TransferComponent]
})
export class TriTransferModule {}
