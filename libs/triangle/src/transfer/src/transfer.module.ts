import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransferComponent } from '@gradii/triangle/transfer/src/transfer.component';
import { TransferListComponent } from '@gradii/triangle/transfer/src/transfer-list.component';
import { TransferSearchComponent } from '@gradii/triangle/transfer/src/transfer-search.component';
import { TriCheckboxModule, TriInputModule } from '@gradii/triangle/inputs';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriLocaleModule } from '@gradii/triangle/locale';

@NgModule({
  imports:      [CommonModule, FormsModule, TriCheckboxModule, TriButtonModule, TriInputModule, TriLocaleModule],
  declarations: [TransferComponent, TransferListComponent, TransferSearchComponent],
  exports:      [TransferComponent]
})
export class TriTransferModule { }
