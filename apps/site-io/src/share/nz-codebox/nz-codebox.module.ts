import { NgModule } from '@angular/core';
import { NzCodeBoxComponent } from './nz-codebox.component';
import { CommonModule } from '@angular/common';
import { NzHighlightModule } from '../nz-highlight/nz-highlight.module';
import { TriToolTipModule } from '@gradii/triangle/tooltip';

@NgModule({
  imports     : [
    CommonModule,
    NzHighlightModule,

    TriToolTipModule
  ],
  declarations: [NzCodeBoxComponent],
  exports     : [NzCodeBoxComponent]
})

export class NzCodeBoxModule {
}

