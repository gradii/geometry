import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriAffixModule } from '@gradii/triangle/affix';
import { TableOfContents } from './table-of-contents';
import { RouterModule } from '@angular/router';

@NgModule({
  imports        : [CommonModule, RouterModule, TriAffixModule],
  declarations   : [TableOfContents],
  exports        : [TableOfContents],
  entryComponents: [TableOfContents],
})
export class TableOfContentsModule {}
