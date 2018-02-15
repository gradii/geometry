import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconTagDirective } from './icon.directive';

@NgModule({imports: [CommonModule], declarations: [IconTagDirective], exports: [IconTagDirective]})
export class TriIconModule {}
