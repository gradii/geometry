import { NgModule } from '@angular/core';
import { PopConfirmComponent } from './popconfirm.component';
import { PopConfirmDirective } from './popconfirm.directive';
import { CommonModule } from '@angular/common';
import { TriButtonModule } from '@gradii/triangle/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { TriLocaleModule } from '@gradii/triangle/locale';

@NgModule({
  declarations: [PopConfirmComponent, PopConfirmDirective],
  exports: [PopConfirmComponent, PopConfirmDirective],
  imports: [CommonModule, TriButtonModule, OverlayModule, TriLocaleModule]
})
export class TriPopConfirmModule {}
